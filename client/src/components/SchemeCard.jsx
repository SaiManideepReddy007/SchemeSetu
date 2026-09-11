import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localize, localizeBenefitType, localizeEligibility } from '../utils/localize';
import BookmarkButton from './BookmarkButton';
import DocumentChecklist from './DocumentChecklist';
import SchemeImage from './SchemeImage';

function SchemeCard({ scheme, bookmarkedIds, onBookmarkChange, onViewScheme }) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    if (!expanded) {
      onViewScheme?.(scheme._id);
    }
    setExpanded(!expanded);
  };

  return (
    <article className="scheme-card">
      <SchemeImage scheme={scheme} className="scheme-card-image" />
      <div className="scheme-card-main">
        <h3><Link to={`/scheme/${scheme._id}`} className="scheme-title-link">{localize(scheme.name, i18n.language)}</Link></h3>
        <p className="ministry">{localize(scheme.ministry, i18n.language)}</p>
        <p className="description">{localize(scheme.description, i18n.language)}</p>

        {scheme.matchReason && (
          <p className="match-reason">{scheme.matchReason}</p>
        )}

        <dl className="benefit-line">
          <dt>{localizeBenefitType(scheme.benefits?.type, i18n.language) || t('scheme.benefit')}</dt>
          <dd>{localize(scheme.benefits?.amount, i18n.language) || t('scheme.seeDetails')}</dd>
        </dl>

        <div className="card-actions">
          <button type="button" className="link-button" onClick={toggleExpand}>
            {expanded ? t('scheme.hideDetails') : t('scheme.showDetails')}
          </button>
          <a
            href={scheme.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-link"
            onClick={() => onViewScheme?.(scheme._id)}
            title={`Opens ${scheme.applyLink} in a new tab`}
          >
            {t('scheme.applyButton')} ↗
          </a>
          <BookmarkButton
            schemeId={scheme._id}
            bookmarkedIds={bookmarkedIds}
            onBookmarkChange={onBookmarkChange}
          />
        </div>

        {expanded && (
          <div className="scheme-details">
            <div>
              <h4>{t('scheme.documentsRequired')}</h4>
              <DocumentChecklist schemeId={scheme._id} documents={scheme.documentsRequired} />
            </div>
            <div>
              <h4>{t('scheme.eligibility')}</h4>
              <ul className="plain-list">
                <li>{t('scheme.category')}: {scheme.eligibility?.category?.map((value) => localizeEligibility(value, i18n.language)).join(', ')}</li>
                <li>{t('scheme.businessType')}: {scheme.eligibility?.businessType?.map((value) => localizeEligibility(value, i18n.language)).join(', ')}</li>
                <li>{t('scheme.states')}: {scheme.eligibility?.states?.join(', ')}</li>
                <li>{t('scheme.minAge')}: {scheme.eligibility?.minAge}</li>
                {scheme.eligibility?.maxIncome && (
                  <li>{t('scheme.maxIncome')}: ₹{scheme.eligibility.maxIncome.toLocaleString('en-IN')}</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default SchemeCard;