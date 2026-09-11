import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getDocumentProgress, updateDocumentProgress } from '../api/schemeApi';
import { localize } from '../utils/localize';

function DocumentChecklist({ schemeId, documents }) {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, token } = useAuth();
  const [checked, setChecked] = useState(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setChecked(new Set());
      return;
    }
    setChecked(new Set());
    getDocumentProgress(schemeId, token)
      .then((data) => setChecked(new Set(data.checkedDocuments)))
      .catch((err) => console.error(err));
  }, [isLoggedIn, schemeId, token]);

  const toggleDocument = async (doc) => {
    const newChecked = new Set(checked);
    if (newChecked.has(doc)) {
      newChecked.delete(doc);
    } else {
      newChecked.add(doc);
    }
    setChecked(newChecked);

    if (!isLoggedIn) return;
    setSaving(true);
    try {
      await updateDocumentProgress(schemeId, Array.from(newChecked), token);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const documentList = Array.isArray(documents) ? documents : [];
  const totalCount = documentList.length;
  const documentKeys = new Set(documentList.map((doc) => localize(doc, 'en')));
  const progressCount = Array.from(checked).filter((doc) => documentKeys.has(doc)).length;

  return (
    <div className="document-checklist">
      {isLoggedIn && totalCount > 0 && (
        <p className="checklist-progress">
          {t('checklist.progress', { checked: progressCount, total: totalCount })}
          {saving && <span className="saving-indicator"> · {t('checklist.saving')}</span>}
        </p>
      )}
      <ul className="checklist-list">
        {documentList.map((doc, i) => {
          const documentKey = localize(doc, 'en');
          return (
            <li key={i}>
              <label className="checklist-item">
                <input
                  type="checkbox"
                  checked={checked.has(documentKey)}
                  onChange={() => toggleDocument(documentKey)}
                  disabled={!isLoggedIn}
                />
                <span className={checked.has(documentKey) ? 'checked-text' : ''}>
                  {localize(doc, i18n.language)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {(!documents || documents.length === 0) && (
        <p className="documents-empty">{t('scheme.documentsNotListed', 'Document requirements are not listed in the current record. Check the official portal before applying.')}</p>
      )}
      {!isLoggedIn && (
        <p className="checklist-hint">{t('checklist.loginHint')}</p>
      )}
    </div>
  );
}

export default DocumentChecklist;