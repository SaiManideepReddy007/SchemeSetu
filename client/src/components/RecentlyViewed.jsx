import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getHistory, removeFromHistory, clearHistory } from '../api/schemeApi';
import { localize } from '../utils/localize';

const LOCAL_STORAGE_KEY = 'schemesetu_recent_views';

function RecentlyViewed({ refreshKey }) {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, token } = useAuth();
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    if (isLoggedIn && token) {
      try {
        const data = await getHistory(token);
        const valid = Array.isArray(data) ? data.filter((s) => s && s._id) : [];
        setHistory(valid);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(valid.slice(0, 10)));
        } catch {}
      } catch (err) {
        console.error('Failed to load history from backend:', err);
        // Fallback to local storage
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) setHistory(JSON.parse(stored));
        } catch {}
      }
    } else {
      // Guest session: use localStorage
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setHistory(Array.isArray(parsed) ? parsed.filter((s) => s && s._id) : []);
        } else {
          setHistory([]);
        }
      } catch {
        setHistory([]);
      }
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, refreshKey]);

  const handleRemoveOne = async (e, schemeId) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setHistory((prev) => prev.filter((s) => s._id !== schemeId));

    // Update local storage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored).filter((s) => s._id !== schemeId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {}

    if (isLoggedIn && token) {
      try {
        await removeFromHistory(schemeId, token);
      } catch (err) {
        console.error('Failed to remove scheme from history:', err);
      }
    }
  };

  const handleClearAll = async () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}

    if (isLoggedIn && token) {
      try {
        await clearHistory(token);
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
    }
  };

  if (!history || history.length === 0) return null;

  return (
    <div className="recently-viewed">
      <div className="recently-viewed-header">
        <h3>{t('explore.recentlyViewed', 'Recently viewed')}</h3>
        <button
          type="button"
          className="recently-viewed-clear-all"
          onClick={handleClearAll}
          title={t('explore.clearRecentlyViewed', 'Clear all recently viewed')}
        >
          {t('common.clearAll', 'Clear all')}
        </button>
      </div>

      <div className="recently-viewed-list">
        {history.map((scheme) => {
          if (!scheme || !scheme._id) return null;
          return (
            <div key={scheme._id} className="recently-viewed-chip-wrap">
              <Link
                to={`/scheme/${scheme._id}`}
                className="recently-viewed-chip"
                title={localize(scheme.name, i18n.language)}
              >
                <span className="recently-viewed-title">
                  {localize(scheme.name, i18n.language)}
                </span>
              </Link>
              <button
                type="button"
                className="recently-viewed-remove"
                onClick={(e) => handleRemoveOne(e, scheme._id)}
                aria-label={t('common.remove', 'Remove')}
                title={t('common.remove', 'Remove')}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentlyViewed;