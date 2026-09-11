import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { addBookmark, removeBookmark } from '../api/schemeApi';

function BookmarkButton({ schemeId, bookmarkedIds, onBookmarkChange }) {
  const { t } = useTranslation();
  const { isLoggedIn, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const isBookmarked = bookmarkedIds?.has(schemeId);

  const handleClick = async () => {
    if (!isLoggedIn) {
      alert(t('auth.loginToSave'));
      return;
    }
    setLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(schemeId, token);
      } else {
        await addBookmark(schemeId, token);
      }
      onBookmarkChange();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
      onClick={handleClick}
      disabled={loading}
      aria-pressed={isBookmarked}
    >
      {isBookmarked ? `★ ${t('scheme.saved')}` : `☆ ${t('scheme.save')}`}
    </button>
  );
}

export default BookmarkButton;