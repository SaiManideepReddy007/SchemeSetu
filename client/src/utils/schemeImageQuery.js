import { localize } from './localize';

// Builds a specific, photogenic Unsplash query from scheme-specific details,
// so schemes sharing a businessType still get visually distinct images.

const typeKeywords = {
  manufacturing: 'factory workshop',
  service: 'small business office',
  retail: 'shop store',
  agri: 'farm field'
};

export function getImageQuery(scheme) {
  const type = scheme.eligibility?.businessType?.[0];
  const typeWords = typeKeywords[type] || 'small business';

  // Pull a distinguishing word from the scheme name itself where possible
  const name = localize(scheme.name, 'en').toLowerCase();
  let subject = '';
  if (name.includes('women') || name.includes('mahila')) subject = 'women entrepreneur';
  else if (name.includes('dairy')) subject = 'dairy farming';
  else if (name.includes('textile')) subject = 'textile weaving';
  else if (name.includes('handicap') || name.includes('disab')) subject = 'inclusive workplace';
  else if (name.includes('startup') || name.includes('seed fund')) subject = 'startup team';
  else if (name.includes('sc-st') || name.includes('scheduled')) subject = 'rural entrepreneur';

  const ministry = localize(scheme.ministry, 'en').replace(/ministry|department|of|the/gi, '').trim();
  const schemeWords = name.split(/[^a-z0-9]+/).filter((word) => word.length > 4).slice(0, 2).join(' ');
  const query = subject ? `${subject} india` : `${schemeWords || typeWords} ${ministry} india`;
  return query;
}