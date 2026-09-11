import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getBookmarks, recordView, addApplication } from '../api/schemeApi';
import axios from 'axios';
import BookmarkButton from '../components/BookmarkButton';
import DocumentChecklist from '../components/DocumentChecklist';
import SchemeImage from '../components/SchemeImage';
import { localize, localizeBenefitType, localizeEligibility } from '../utils/localize';

const API_BASE_URL = 'http://localhost:5000/api';

function SchemeDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { isLoggedIn, token } = useAuth();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(`${API_BASE_URL}/schemes/${id}`)
      .then((res) => {
        setScheme(res.data);
        if (isLoggedIn) {
          recordView(id, token).catch((err) => console.error(err));
        }
      })
      .catch(() => setError(t('scheme.notFound')))
      .finally(() => setLoading(false));
  }, [id, isLoggedIn, token, t]);

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

  const trackApplicationStart = () => {
    if (isLoggedIn && token && scheme?._id) {
      addApplication(scheme._id, token).catch((err) => console.error('Failed to save application:', err));
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  if (loading) {
    return (
      <main className="content">
        <div className="loading-state">
          <div className="spinner" aria-hidden="true" />
          <p>{t('scheme.loadingDetails')}</p>
        </div>
      </main>
    );
  }

  if (error || !scheme) {
    return (
      <main className="content">
        <div className="empty-state">
          <p>{error || t('scheme.notFound')}</p>
          <Link to="/explore" className="apply-link" style={{ marginTop: '1rem', display: 'inline-block' }}>
            {t('scheme.backToExplore')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="content">
      <Link to="/explore" className="back-link">{t('scheme.backToExplore')}</Link>

      <div className="detail-hero glass-panel">
        <SchemeImage scheme={scheme} className="detail-hero-image" />
        <p className="detail-ministry">{localize(scheme.ministry, i18n.language)}</p>
        <h1 className="detail-title">{localize(scheme.name, i18n.language)}</h1>
        <p className="detail-description">{localize(scheme.description, i18n.language)}</p>

        <div className="detail-tags">
          <span>{localizeBenefitType(scheme.benefits?.type, i18n.language) || t('scheme.support', 'Government support')}</span>
          <span>{scheme.eligibility?.newOrExisting === 'new' ? t('scheme.newBusinesses', 'New businesses') : t('scheme.newAndExisting', 'New and existing businesses')}</span>
        </div>

        <div className="detail-actions">
          <a
            href={scheme.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-link apply-link-large"
            onClick={trackApplicationStart}
            title={`Opens ${scheme.applyLink} in a new tab`}
          >
            {t('scheme.applyButton')} ↗
          </a>
          <BookmarkButton
            schemeId={scheme._id}
            bookmarkedIds={bookmarkedIds}
            onBookmarkChange={loadBookmarks}
          />
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-block glass-panel">
          <h2>{t('scheme.benefit')}</h2>
          <p className="detail-benefit-type">{localizeBenefitType(scheme.benefits?.type, i18n.language)}</p>
          <p className="detail-benefit-amount">{localize(scheme.benefits?.amount, i18n.language)}</p>
          <p className="detail-note">{t('scheme.verifyBenefit', 'Benefits and limits can change. Confirm the latest details on the official portal.')}</p>
        </div>

        <div className="detail-block glass-panel">
          <h2>{t('scheme.whoCanApply')}</h2>
          <ul className="plain-list">
            <li><strong>{t('scheme.category')}:</strong> {scheme.eligibility?.category?.map((value) => localizeEligibility(value, i18n.language)).join(', ')}</li>
            <li><strong>{t('scheme.businessType')}:</strong> {scheme.eligibility?.businessType?.map((value) => localizeEligibility(value, i18n.language)).join(', ')}</li>
            <li><strong>{t('scheme.states')}:</strong> {scheme.eligibility?.states?.join(', ')}</li>
            <li><strong>{t('scheme.minAge')}:</strong> {scheme.eligibility?.minAge}</li>
            {scheme.eligibility?.maxIncome && (
              <li><strong>{t('scheme.maxIncome')}:</strong> ₹{scheme.eligibility.maxIncome.toLocaleString('en-IN')}</li>
            )}
            <li><strong>{t('scheme.appliesTo')}:</strong> {localizeEligibility(scheme.eligibility?.newOrExisting, i18n.language)} {t('scheme.newOrExistingSuffix')}</li>
          </ul>
        </div>
      </div>

      <div className="detail-block glass-panel">
        <h2>{t('scheme.documentsRequired')}</h2>
        <DocumentChecklist schemeId={scheme._id} documents={scheme.documentsRequired} />
      </div>

      <div className="detail-block glass-panel detail-steps">
        <h2>{t('scheme.nextSteps', 'What to do next')}</h2>
        <ol>
          <li>{t('scheme.stepOne', 'Review the eligibility conditions and collect the listed documents.')}</li>
          <li>{t('scheme.stepTwo', 'Open the official application portal using the button above.')}</li>
          <li>{t('scheme.stepThree', 'Keep your application reference number to track updates.')}</li>
        </ol>
      </div>
    </main>
  );
}

export default SchemeDetail;