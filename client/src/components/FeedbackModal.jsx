import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitFeedback } from '../api/schemeApi';

function FeedbackModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { isLoggedIn, token } = useAuth();
  const location = useLocation();

  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 5) {
      setError(t('feedback.minLengthError', 'Please enter at least 5 characters.'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitFeedback(
        {
          category,
          message: message.trim(),
          pageContext: location.pathname
        },
        token
      );
      setSuccess(true);
      setMessage('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Feedback submit error:', err);
      setError(
        err.response?.data?.error ||
          t('feedback.submitError', 'Unable to submit feedback. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className="modal-card feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="feedback-title">{t('feedback.title', 'Share Your Feedback')}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t('common.close', 'Close')}>
            ×
          </button>
        </div>

        {!isLoggedIn ? (
          <div className="feedback-login-prompt">
            <p>{t('feedback.loginRequired', 'Please log in to submit feedback about your experience.')}</p>
            <div className="feedback-login-actions">
              <Link to="/login" className="apply-link" onClick={onClose}>
                {t('nav.login', 'Log in')}
              </Link>
              <button type="button" className="link-button" onClick={onClose}>
                {t('common.cancel', 'Cancel')}
              </button>
            </div>
          </div>
        ) : success ? (
          <div className="feedback-success">
            <span className="feedback-check-icon">✓</span>
            <h3>{t('feedback.thankYou', 'Thank you for your feedback!')}</h3>
            <p>{t('feedback.received', 'Your response helps us improve SchemeSetu for all citizens.')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <label>
              {t('feedback.categoryLabel', 'What would you like to tell us about?')}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <option value="website">{t('feedback.catWebsite', 'Website experience')}</option>
                <option value="scheme_info">{t('feedback.catSchemeInfo', 'Scheme information')}</option>
                <option value="chatbot">{t('feedback.catChatbot', 'Chatbot (Setu)')}</option>
                <option value="recommendations">{t('feedback.catRecommendations', 'Recommendations')}</option>
                <option value="bug">{t('feedback.catBug', 'Bugs or technical problems')}</option>
                <option value="general">{t('feedback.catGeneral', 'General suggestions')}</option>
              </select>
            </label>

            <label>
              {t('feedback.messageLabel', 'Your Message')}
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (error) setError('');
                }}
                rows={4}
                placeholder={t(
                  'feedback.placeholder',
                  'Tell us what worked well, what was confusing, or what we should add...'
                )}
                required
                disabled={loading}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              <button type="button" className="link-button" onClick={onClose} disabled={loading}>
                {t('common.cancel', 'Cancel')}
              </button>
              <button type="submit" className="landing-primary-button" disabled={loading || !message.trim()}>
                {loading ? t('feedback.submitting', 'Submitting…') : t('feedback.submit', 'Send feedback')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FeedbackModal;
