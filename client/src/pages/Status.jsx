import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getApplications, updateApplicationStatus } from '../api/schemeApi';
import { localize } from '../utils/localize';

const STATUS_OPTIONS = [
  'Applied',
  'Under Review',
  'Documents Required',
  'Documents Submitted',
  'Approved',
  'Rejected'
];

function Status() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [updateFeedback, setUpdateFeedback] = useState({}); // { [appId]: { type: 'success' | 'error', message: '' } }

  const loadApplications = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getApplications(token);
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(t('home.connectionError', 'Unable to load applications. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [isLoggedIn, token, t]);

  const handleStatusChange = async (appId, newStatus) => {
    if (!token || updatingId) return;
    setUpdatingId(appId);
    setUpdateFeedback((prev) => ({ ...prev, [appId]: null }));

    try {
      const updated = await updateApplicationStatus(appId, newStatus, token);
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: updated.status } : app))
      );
      setUpdateFeedback((prev) => ({
        ...prev,
        [appId]: { type: 'success', message: t('status.updated', 'Status updated successfully') }
      }));
      setTimeout(() => {
        setUpdateFeedback((prev) => ({ ...prev, [appId]: null }));
      }, 3500);
    } catch (err) {
      console.error('Status update failed:', err);
      const errMsg =
        err.response?.data?.error ||
        (err.response?.status === 403
          ? t('status.unauthorized', 'You can only update your own applications.')
          : t('status.updateFailed', 'Failed to update status. Please try again.'));
      setUpdateFeedback((prev) => ({
        ...prev,
        [appId]: { type: 'error', message: errMsg }
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-badge-approved';
      case 'Rejected':
        return 'status-badge-rejected';
      case 'Under Review':
        return 'status-badge-review';
      case 'Documents Required':
        return 'status-badge-required';
      case 'Documents Submitted':
        return 'status-badge-submitted';
      case 'Applied':
        return 'status-badge-applied';
      default:
        return 'status-badge-started';
    }
  };

  return (
    <main className="content">
      <section className="intro">
        <h1>{t('status.title')}</h1>
        <p>{t('status.subtitle')}</p>
      </section>

      {!isLoggedIn ? (
        <div className="empty-state status-empty">
          <p>{t('bookmarks.loginPrompt', 'Please log in to view your application status.')}</p>
          <Link to="/login" className="apply-link" style={{ marginTop: '1rem', display: 'inline-block' }}>
            {t('nav.login')}
          </Link>
        </div>
      ) : loading ? (
        <div className="loading-state">
          <div className="spinner" aria-hidden="true" />
          <p>{t('home.loadingMessage', 'Loading applications...')}</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p className="error">{error}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state status-empty">
          <span className="status-empty-icon">✓</span>
          <h2>{t('status.emptyTitle')}</h2>
          <p>{t('status.emptyText')}</p>
          <Link to="/explore" className="apply-link">
            {t('status.explore')}
          </Link>
        </div>
      ) : (
        <div className="status-list">
          {applications.map((application) => {
            const appId = application.id || application.schemeId;
            const isUpdating = updatingId === appId;
            const feedback = updateFeedback[appId];

            return (
              <div className="status-row status-row-interactive" key={appId}>
                <div className="status-info">
                  <Link to={`/scheme/${application.schemeId}`} className="status-scheme-name">
                    {localize(application.name, i18n.language)}
                  </Link>
                  <small className="status-date">
                    {t('status.startedOn', 'Tracked on')}: {new Date(application.startedAt).toLocaleDateString()}
                  </small>
                </div>

                <div className="status-controls">
                  <div className="status-badge-wrap">
                    <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                      <span className="status-dot" aria-hidden="true" />
                      {application.status}
                    </span>
                  </div>

                  <div className="status-selector-wrap">
                    <label htmlFor={`status-select-${appId}`} className="visually-hidden">
                      {t('status.updateStatusLabel', 'Update application status')}
                    </label>
                    <select
                      id={`status-select-${appId}`}
                      className="status-select"
                      value={application.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(appId, e.target.value)}
                    >
                      {application.status === 'Started' && (
                        <option value="Started">{t('status.started', 'Started')}</option>
                      )}
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {isUpdating && <span className="status-saving-spinner" aria-hidden="true" />}
                  </div>
                </div>

                {feedback && (
                  <div className={`status-feedback ${feedback.type === 'error' ? 'status-feedback-error' : 'status-feedback-success'}`}>
                    {feedback.message}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Status;