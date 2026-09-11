import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import SchemeDetail from './pages/SchemeDetail';
import Landing from './pages/Landing';
import ChatWidget from './components/ChatWidget';
import Help from './pages/Help';
import Bookmarks from './pages/Bookmarks';
import Status from './pages/Status';

function NavBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'light';
  const toggleTheme = themeContext?.toggleTheme || (() => {});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="masthead">
      <div className="masthead-inner nav-inner">
        <div className="brand-cluster">
          <div className="gov-emblem" aria-label="Government of India">
            <span className="gov-emblem-symbol">✺</span>
            <span>सत्यमेव जयते</span>
          </div>
          <Link to="/" className="mark-link">
          <span className="mark-wrapper">
            <img src="/favicon.svg" alt="" className="mark-icon" />
            <span className="brand-copy">
              <span className="mark">Scheme<span>Setu</span></span>
              <small>Government Schemes | Your Right, Our Priority</small>
            </span>
          </span>
          </Link>
        </div>
        <nav className="nav-links nav-links-desktop">
          <Link to="/find" className="nav-link">{t('nav.findSchemes', 'Find schemes')}</Link>
          <Link to="/explore" className="nav-link nav-link-explore">{t('nav.explore')}</Link>
          {isLoggedIn ? (
            <>
              <Link to="/settings" className="nav-link">{t('nav.settings')}</Link>
              <span className="nav-greeting">{t('nav.greeting', { name: user?.name ? user.name.split(' ')[0] : 'User' })}</span>
              <button onClick={handleLogout} className="nav-button">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">{t('nav.login')}</Link>
              <Link to="/register" className="nav-link nav-link-primary">{t('nav.signup')}</Link>
            </>
          )}
        </nav>
        <div className="account-menu-wrap">
          <button
            type="button"
            className="theme-toggle-top"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t('settings.switchToDark', 'Switch to dark mode') : t('settings.switchToLight', 'Switch to light mode')}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={t('nav.openMenu', 'Open account menu')}
          >
            <span /><span /><span />
          </button>
          {menuOpen && (
            <div className="account-menu">
              {isLoggedIn && <div className="account-menu-user">{t('nav.greeting', { name: user?.name ? user.name.split(' ')[0] : 'User' })}</div>}
              <Link to="/settings" onClick={() => setMenuOpen(false)}>{t('nav.settings')}</Link>
              <Link to="/bookmarks" onClick={() => setMenuOpen(false)}>{t('nav.bookmarks', 'My bookmarks')}</Link>
              <Link to="/status" onClick={() => setMenuOpen(false)}>{t('nav.status', 'Application status')}</Link>
              <Link to="/help" onClick={() => setMenuOpen(false)}>{t('nav.help', 'Help and FAQs')}</Link>
              {isLoggedIn ? (
                <button type="button" onClick={() => { setMenuOpen(false); handleLogout(); }}>{t('nav.logout')}</button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  const { t } = useTranslation();

  return (
    <div className="page">
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/find" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/scheme/:id" element={<SchemeDetail />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/status" element={<Status />} />
        <Route path="/help" element={<Help />} />
      </Routes>
      <ChatWidget />
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span className="footer-government">✺ Government of India</span>
          <span>{t('footer.disclaimer')}</span>
          <span>Terms &amp; Conditions</span>
          <span>Privacy Policy</span>
          <Link className="footer-help-link" to="/help">Help</Link>
          <span className="footer-digital">Digital India | Sabka Saath, Sabka Vikas</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;