import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { matchSchemes, getBookmarks, recordView, getNearMisses } from '../api/schemeApi';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/SchemeCard';
import { localize } from '../utils/localize';
import VoiceInputButton from '../components/VoiceInputButton';
import { businessTypes, indiaLocations } from '../utils/indiaLocations';

function Home() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, token } = useAuth();

  const [formData, setFormData] = useState({
    category: '',
    state: '',
    businessType: '',
    income: '',
    age: '',
    description: '',
    customBusinessType: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [nearMisses, setNearMisses] = useState([]);

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
    loadBookmarks();
  }, [loadBookmarks]);

  const handleChange = (e) => {
    const next = { ...formData, [e.target.name]: e.target.value };
    if (e.target.name === 'businessType' && e.target.value !== 'other') next.customBusinessType = '';
    setFormData(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!indiaLocations.includes(formData.state)) {
      setError(t('home.invalidState', 'Choose a state or Union Territory from the suggestions.'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const searchData = {
        ...formData,
        businessType: formData.businessType === 'other' ? formData.customBusinessType : formData.businessType
      };
      const data = await matchSchemes(searchData);
      setResults(data);
      setSearched(true);

      try {
        const nearMissData = await getNearMisses(searchData);
        setNearMisses(nearMissData.gaps || []);
      } catch (nearMissErr) {
        console.error('Near-miss fetch failed:', nearMissErr);
        setNearMisses([]);
      }
    } catch (err) {
      setError(t('home.connectionError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewScheme = async (schemeId) => {
    if (!isLoggedIn) return;
    try {
      await recordView(schemeId, token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="content">
      <section className="intro">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </section>

      <form onSubmit={handleSubmit} className="scheme-form">
        <div className="field-row">
          <label>
            {t('home.category')}
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">{t('home.categoryOptions.select')}</option>
              <option value="General">{t('home.categoryOptions.general')}</option>
              <option value="SC">{t('home.categoryOptions.sc')}</option>
              <option value="ST">{t('home.categoryOptions.st')}</option>
              <option value="OBC">{t('home.categoryOptions.obc')}</option>
              <option value="Women">{t('home.categoryOptions.women')}</option>
              <option value="Disabled">{t('home.categoryOptions.disabled')}</option>
            </select>
          </label>

          <label>
            {t('home.state')}
            <input
              type="text"
              name="state"
              list="india-locations"
              placeholder={t('home.statePlaceholder')}
              value={formData.state}
              onChange={handleChange}
              required
            />
            <datalist id="india-locations">
              {indiaLocations.map((location) => <option value={location} key={location} />)}
            </datalist>
          </label>
        </div>

        <div className="field-row">
          <label>
            {t('home.businessType')}
            <select name="businessType" value={formData.businessType} onChange={handleChange} required>
              <option value="">{t('home.businessTypeOptions.select')}</option>
              {businessTypes.map(([value, label]) => <option value={value} key={value}>{t(`home.businessTypeOptions.${value}`, label)}</option>)}
            </select>
          </label>

          {formData.businessType === 'other' && (
            <label>
              {t('home.customBusinessType', 'Tell us your business type')}
              <input name="customBusinessType" value={formData.customBusinessType} onChange={handleChange} required placeholder={t('home.customBusinessPlaceholder', 'e.g. repair services')} />
            </label>
          )}

          <label>
            {t('home.age')}
            <input
              type="number"
              name="age"
              placeholder={t('home.agePlaceholder')}
              value={formData.age}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          {t('home.income')}
          <input
            type="number"
            name="income"
            placeholder={t('home.incomePlaceholder')}
            value={formData.income}
            onChange={handleChange}
          />
        </label>

        <label className="description-field">
          {t('home.description')}
          <textarea
            name="description"
            placeholder={t('home.descriptionPlaceholder')}
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
          <span className="field-tools">
            <span className="hint">{t('home.descriptionHint')}</span>
            <VoiceInputButton onResult={(text) => setFormData((current) => ({ ...current, description: `${current.description} ${text}`.trim() }))} label={t('home.speakDescription', 'Speak your business idea')} />
          </span>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? t('home.searching') : t('home.submit')}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading && (
        <div className="loading-state">
          <div className="spinner" aria-hidden="true" />
          <p>{t('home.loadingMessage')}</p>
        </div>
      )}

      {searched && !loading && (
        <section className="results">
          <div className="results-header">
            <h2>
              {results.length === 0
                ? t('home.noResultsTitle')
                : t('home.resultsTitle', { count: results.length })}
            </h2>
          </div>

          {results.length === 0 && (
            <div className="empty-state">
              <p>{t('home.emptyStateText')}</p>
            </div>
          )}

          {results.map((scheme) => (
            <SchemeCard
              key={scheme._id}
              scheme={scheme}
              bookmarkedIds={bookmarkedIds}
              onBookmarkChange={loadBookmarks}
              onViewScheme={handleViewScheme}
            />
          ))}

          {nearMisses.length > 0 && (
            <div className="near-miss-section">
              <h3>{t('nearMiss.title')}</h3>
              <p className="near-miss-intro">{t('nearMiss.intro')}</p>
              {nearMisses.map((scheme) => (
                <div key={scheme._id} className="near-miss-card">
                  <h4>{localize(scheme.name, i18n.language)}</h4>
                  <p className="gap-explanation">{scheme.gapExplanation}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Home;