import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllSchemes, smartMatch, getBookmarks, recordView } from '../api/schemeApi';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';
import RecentlyViewed from '../components/RecentlyViewed';
import VoiceInputButton from '../components/VoiceInputButton';

function Explore() {
  const { t } = useTranslation();
  const { isLoggedIn, token } = useAuth();

  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [smartText, setSmartText] = useState('');
  const [smartResults, setSmartResults] = useState(null);
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartError, setSmartError] = useState('');

  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const loadSchemes = useCallback(async (term = '') => {
    setLoading(true);
    try {
      const data = await getAllSchemes(term);
      setSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBookmarks = useCallback(async () => {
    if (!isLoggedIn) {
      setBookmarkedIds(new Set());
      return;
    }
    try {
      const data = await getBookmarks(token);
      setBookmarkedIds(new Set(data.map((s) => s._id)));
    } catch (err) {
      console.error(err);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleViewScheme = async (schemeId) => {
    if (!isLoggedIn) return;
    try {
      await recordView(schemeId, token);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSchemes(searchTerm);
  };

  const handleSmartSearch = async (e) => {
    e.preventDefault();
    if (smartText.trim().length < 10) {
      setSmartError(t('explore.smartSearchTooShort'));
      return;
    }
    setSmartError('');
    setSmartLoading(true);
    setSmartResults(null);
    try {
      const data = await smartMatch(smartText);
      setSmartResults(data);
    } catch (err) {
      setSmartError(err.response?.data?.error || t('auth.genericError'));
    } finally {
      setSmartLoading(false);
    }
  };

  return (
    <main className="content">
      <section className="intro">
        <h1>{t('explore.title')}</h1>
        <p>{t('explore.subtitle')}</p>
      </section>

      <RecentlyViewed refreshKey={historyRefreshKey} />

      <div className="smart-search-box">
        <form onSubmit={handleSmartSearch} className="smart-search-form">
          <label>
            {t('explore.smartSearchLabel')}
            <textarea
              value={smartText}
              onChange={(e) => setSmartText(e.target.value)}
              placeholder={t('explore.smartSearchPlaceholder')}
              rows={3}
            />
            <VoiceInputButton onResult={(text) => setSmartText((current) => `${current} ${text}`.trim())} label={t('explore.speakSearch', 'Speak your search')} />
          </label>
          <button type="submit" disabled={smartLoading}>
            {smartLoading ? t('explore.analyzing') : t('explore.smartSearchSubmit')}
          </button>
        </form>
        {smartError && <p className="error">{smartError}</p>}
      </div>

      {smartResults && (
        <section className="results">
          <div className="results-header">
            <h2>
              {smartResults.results.length === 0
                ? t('home.noResultsTitle')
                : t('explore.smartResultsTitle', { count: smartResults.results.length })}
            </h2>
          </div>
          {smartResults.results.map((scheme) => (
            <SchemeCard
              key={scheme._id}
              scheme={scheme}
              bookmarkedIds={bookmarkedIds}
              onBookmarkChange={loadBookmarks}
              onViewScheme={handleViewScheme}
            />
          ))}
        </section>
      )}

      <hr className="section-divider" />

      <section className="browse-section">
        <h2>{t('explore.browseTitle')}</h2>
        <form onSubmit={handleSearchSubmit} className="browse-search-form">
          <input
            type="text"
            placeholder={t('explore.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">{t('explore.searchButton')}</button>
        </form>

        {loading ? (
          <p className="loading-text">{t('explore.loadingSchemes')}</p>
        ) : schemes.length === 0 ? (
          <p className="loading-text">{t('explore.noSchemesFound')}</p>
        ) : (
          <div className="browse-grid">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme._id}
                scheme={scheme}
                bookmarkedIds={bookmarkedIds}
                onBookmarkChange={loadBookmarks}
                onViewScheme={handleViewScheme}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Explore;