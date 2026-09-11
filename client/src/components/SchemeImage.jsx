import { useState, useEffect } from 'react';
import { getSchemeImage } from '../api/schemeApi';
import { getImageQuery } from '../utils/schemeImageQuery';

function getSchemeIcon(scheme) {
  const name = String(scheme?.name?.en || scheme?.name || '').toLowerCase();
  const bType = String(scheme?.eligibility?.businessType?.[0] || '').toLowerCase();
  if (name.includes('dairy') || name.includes('agri') || bType === 'agri') return '🌾';
  if (name.includes('textile') || name.includes('handicraft') || name.includes('vishwa')) return '🧵';
  if (name.includes('startup') || name.includes('stand up') || name.includes('seed')) return '🚀';
  if (name.includes('mudra') || name.includes('credit') || name.includes('loan') || name.includes('subsidy')) return '🏛️';
  if (name.includes('women') || name.includes('mahila')) return '👩‍💼';
  if (name.includes('service') || bType === 'service') return '💼';
  return '⚙️';
}

function SchemeImage({ scheme, className }) {
  const [imageData, setImageData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const imageQuery = getImageQuery(scheme);
  const fallbackImg = fallbackImageFor(scheme);

  useEffect(() => {
    let cancelled = false;
    setImgFailed(false);
    setLoaded(false);

    getSchemeImage(imageQuery)
      .then((data) => {
        if (!cancelled) {
          if (data && data.imageUrl) {
            setImageData(data);
          } else if (fallbackImg) {
            setImageData({ imageUrl: fallbackImg, photographerName: '', photographerUrl: '' });
          } else {
            setImageData(null);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          if (fallbackImg) {
            setImageData({ imageUrl: fallbackImg, photographerName: '', photographerUrl: '' });
          } else {
            setImageData(null);
          }
        }
      });
    return () => { cancelled = true; };
  }, [scheme?._id, imageQuery, fallbackImg]);

  const schemeName = typeof scheme?.name === 'string' ? scheme.name : (scheme?.name?.en || 'Government Scheme');
  const sectorIcon = getSchemeIcon(scheme);

  // If image URL is missing or failed to load, show a professional placeholder
  if (!imageData?.imageUrl || imgFailed) {
    return (
      <div className={`scheme-image-wrapper scheme-image-placeholder ${className || ''}`} aria-hidden="true">
        <div className="placeholder-pattern" />
        <div className="placeholder-content">
          <span className="placeholder-sector-icon">{sectorIcon}</span>
          <span className="placeholder-gov-mark">✺ Government Scheme</span>
          <span className="placeholder-title">{schemeName}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`scheme-image-wrapper ${className || ''}`}>
      <img
        src={imageData.imageUrl}
        alt=""
        className={`scheme-image ${loaded ? 'loaded' : ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => setImgFailed(true)}
        loading="lazy"
      />
      {imageData.photographerName && (
        <span className="scheme-image-credit">
          Photo: <a href={imageData.photographerUrl} target="_blank" rel="noopener noreferrer">{imageData.photographerName}</a> / Unsplash
        </span>
      )}
    </div>
  );
}

function fallbackImageFor(scheme) {
  const name = String(scheme?.name?.en || scheme?.name || '').toLowerCase();
  if (name.includes('dairy') || name.includes('agri')) return 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80';
  if (name.includes('textile') || name.includes('handicraft')) return 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&w=1200&q=80';
  if (name.includes('startup') || name.includes('enterprise')) return 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80';
  return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80';
}

export default SchemeImage;