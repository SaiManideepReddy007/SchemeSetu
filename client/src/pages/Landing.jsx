import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../components/LanguagePicker';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const { t } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return (
      <main className="landing-page landing-page-member">
        <div className="landing-hero-backdrop" aria-hidden="true" />
        <div className="landing-content">
          <div className="landing-mark">
            <img src="/favicon.svg" alt="" className="landing-icon" />
            <h1 className="landing-title">Welcome, <span>{user?.name?.split(' ')[0]}</span></h1>
          </div>
          <p className="landing-tagline">Pick up where you left off and find support for your next step.</p>
          <div className="landing-actions">
            <button type="button" className="landing-primary-button" onClick={() => navigate('/find')}>Find my schemes</button>
            <button type="button" className="landing-secondary-button" onClick={() => navigate('/bookmarks')}>View saved schemes</button>
          </div>
          <button type="button" className="landing-skip-link landing-logout-link" onClick={() => { logout(); navigate('/'); }}>Log out of SchemeSetu</button>
        </div>
        <section className="landing-features" aria-label="Your account shortcuts">
          <Link className="landing-feature" to="/find"><span className="feature-icon">⌕</span><strong>Find schemes</strong><p>Check eligibility with your details.</p></Link>
          <Link className="landing-feature" to="/bookmarks"><span className="feature-icon">★</span><strong>Saved schemes</strong><p>Return to schemes you bookmarked.</p></Link>
          <Link className="landing-feature" to="/status"><span className="feature-icon">▤</span><strong>Application status</strong><p>Keep your application notes in one place.</p></Link>
          <Link className="landing-feature" to="/settings"><span className="feature-icon">⚙</span><strong>Settings</strong><p>Manage language and appearance.</p></Link>
        </section>
      </main>
    );
  }

  return (
    <main className="landing-page">
      <div className="landing-hero-backdrop" aria-hidden="true" />
      <div className="landing-content">
        <div className="landing-mark">
          <img src="/favicon.svg" alt="" className="landing-icon" />
          <h1 className="landing-title">Scheme<span>Setu</span></h1>
        </div>
        <p className="landing-tagline">
          {t('landing.tagline', 'A bridge to the government schemes you already qualify for.')}
        </p>

        <div className="landing-language">
          <p className="landing-language-label">{t('landing.chooseLanguage', 'Choose your language')}</p>
          <LanguagePicker />
        </div>

        <div className="landing-actions">
          <Link to="/register" className="landing-primary-button">
            {t('nav.signup', 'Sign up')}
          </Link>
          <Link to="/login" className="landing-secondary-button">
            {t('nav.login', 'Log in')}
          </Link>
        </div>

        <Link to="/explore" className="landing-skip-link">
          {t('landing.continueWithoutLogin', 'Continue without logging in')}
        </Link>
      </div>
      <section className="landing-features" aria-label="SchemeSetu features">
        <div className="landing-feature"><span className="feature-icon">⌕</span><strong>{t('landing.features.discover')}</strong><p>{t('landing.features.discoverText')}</p></div>
        <div className="landing-feature"><span className="feature-icon">♙</span><strong>{t('landing.features.eligibility')}</strong><p>{t('landing.features.eligibilityText')}</p></div>
        <div className="landing-feature"><span className="feature-icon">▤</span><strong>{t('landing.features.apply')}</strong><p>{t('landing.features.applyText')}</p></div>
        <div className="landing-feature"><span className="feature-icon">♢</span><strong>{t('landing.features.status')}</strong><p>{t('landing.features.statusText')}</p></div>
      </section>
    </main>
  );
}

export default Landing;