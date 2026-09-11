import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookmarks } from '../api/schemeApi';
import { localize } from '../utils/localize';
import { useTranslation } from 'react-i18next';

function Bookmarks() {
  const { isLoggedIn, token } = useAuth();
  const { t, i18n } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  useEffect(() => { if (isLoggedIn) getBookmarks(token).then(setSchemes).catch(() => setSchemes([])); }, [isLoggedIn, token]);

  return <main className="content"><section className="intro"><h1>{t('bookmarks.title')}</h1><p>{t('bookmarks.subtitle')}</p></section>
    {!isLoggedIn ? <div className="empty-state"><p>{t('bookmarks.loginPrompt')}</p><Link to="/login" className="apply-link">{t('nav.login')}</Link></div> : schemes.length === 0 ? <div className="empty-state"><p>{t('bookmarks.empty')}</p><Link to="/explore" className="apply-link">{t('bookmarks.explore')}</Link></div> : <div className="bookmark-list">{schemes.map((scheme) => <Link className="bookmark-row" to={`/scheme/${scheme._id}`} key={scheme._id}><strong>{localize(scheme.name, i18n.language)}</strong><span>{localize(scheme.ministry, i18n.language)}</span><span>{t('bookmarks.viewDetails')} →</span></Link>)}</div>}
  </main>;
}

export default Bookmarks;