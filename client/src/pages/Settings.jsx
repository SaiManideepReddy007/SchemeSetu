import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { updateNotificationPreferences } from '../api/authApi';

function Settings() {
  const { t, i18n } = useTranslation();
  const { user, token, isLoggedIn, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [emailNotifLoading, setEmailNotifLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');

  const emailNotificationsEnabled = !!user?.preferences?.emailNotifications;

  const handleToggleNotifications = async () => {
    if (!token || emailNotifLoading) return;
    const nextVal = !emailNotificationsEnabled;
    setEmailNotifLoading(true);
    setNotifMessage('');
    try {
      await updateNotificationPreferences(nextVal, token);
      updateUser({ preferences: { ...user?.preferences, emailNotifications: nextVal } });
      setNotifMessage(
        nextVal
          ? t('settings.notificationsEnabled', 'Email notifications enabled')
          : t('settings.notificationsDisabled', 'Email notifications disabled')
      );
      setTimeout(() => setNotifMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update notification settings:', err);
      setNotifMessage(t('settings.notifUpdateFailed', 'Could not update notification setting'));
    } finally {
      setEmailNotifLoading(false);
    }
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'mr', label: 'मराठी (Marathi) — coming soon' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada) — coming soon' },
    { code: 'ta', label: 'தமிழ் (Tamil) — coming soon' },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('schemesetu_language', code);
  };

  if (!isLoggedIn) {
    return (
      <main className="content">
        <section className="intro">
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.loginPrompt')}</p>
        </section>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="content">
      <section className="intro">
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.subtitle')}</p>
      </section>

      <div className="settings-section">
        <h2>{t('settings.account')}</h2>
        <div className="settings-row">
          <span className="settings-label">{t('settings.name')}</span>
          <span className="settings-value">{user.name}</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">{t('settings.email')}</span>
          <span className="settings-value">{user.email}</span>
        </div>
        <button type="button" className="settings-danger-button" onClick={handleLogout}>
          {t('settings.logout')}
        </button>
      </div>

      <div className="settings-section">
        <h2>{t('settings.notifications', 'Notifications')}</h2>
        <div className="settings-row">
          <div>
            <span className="settings-label">{t('settings.emailAlerts', 'New scheme email alerts')}</span>
            <p className="settings-hint">
              {t(
                'settings.emailAlertsHint',
                'Get an email notification whenever a new government scheme is added to SchemeSetu.'
              )}
            </p>
          </div>
          <button
            type="button"
            className={`theme-toggle ${emailNotificationsEnabled ? 'active' : ''}`}
            onClick={handleToggleNotifications}
            disabled={emailNotifLoading}
            aria-pressed={emailNotificationsEnabled}
          >
            {emailNotifLoading
              ? t('settings.saving', 'Saving…')
              : emailNotificationsEnabled
              ? t('settings.enabled', '✓ Enabled')
              : t('settings.disabled', 'Disabled')}
          </button>
        </div>
        {notifMessage && (
          <p className="settings-hint" style={{ marginTop: '0.6rem', color: 'var(--indigo)' }}>
            {notifMessage}
          </p>
        )}
      </div>

      <div className="settings-section">
        <h2>{t('settings.appearance')}</h2>
        <div className="settings-row">
          <span className="settings-label">{t('settings.theme')}</span>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? t('settings.switchToDark') : t('settings.switchToLight')}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>{t('settings.language')}</h2>
        <p className="settings-hint" style={{ marginBottom: '1rem' }}>
          {t('settings.languageHint')}
        </p>
        <div className="language-grid">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
              disabled={!['en', 'hi', 'te'].includes(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>{t('settings.helpCenter')}</h2>
        <p className="settings-hint">{t('settings.helpCenterText')}</p>
      </div>
    </main>
  );
}

export default Settings;