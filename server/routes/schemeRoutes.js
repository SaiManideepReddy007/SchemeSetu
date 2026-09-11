const express = require('express');
const router = express.Router();
const axios = require('axios');
const Scheme = require('../models/Scheme');
const seedSchemes = require('../data/seedSchemes');
const { notifyUsersOfNewScheme } = require('../services/notificationService');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';const AI_TIMEOUT_MS = 20000;
const CATEGORIES = ['General', 'SC', 'ST', 'OBC', 'Women', 'Disabled'];
const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry'
];
const englishText = (field) => (typeof field === 'string' ? field : field?.en || '');
const normalizeCategory = (value) => CATEGORIES.find((item) => item.toLowerCase() === String(value || '').trim().toLowerCase()) || null;
const normalizeState = (value) => INDIA_STATES.find((item) => item.toLowerCase() === String(value || '').trim().toLowerCase()) || null;
const normalizeAge = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const age = Number(value);
  return Number.isFinite(age) && age > 0 ? age : null;
};
const normalizeIncome = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const income = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(income) && income >= 0 ? income : null;
};
const eligibilityQuery = ({ category, state, businessType, income, age }) => {
  const query = {};
  const normalizedCategory = normalizeCategory(category);
  const normalizedState = normalizeState(state);
  const normalizedBusinessType = normalizeBusinessType(businessType);
  const normalizedAge = normalizeAge(age);
  const normalizedIncome = normalizeIncome(income);
  if (normalizedCategory) query['eligibility.category'] = normalizedCategory;
  if (normalizedState) query['eligibility.states'] = { $in: [normalizedState, 'All'] };
  if (normalizedBusinessType) query['eligibility.businessType'] = normalizedBusinessType;
  if (normalizedAge) query['eligibility.minAge'] = { $lte: normalizedAge };
  if (normalizedIncome != null) {
    query.$or = [
      { 'eligibility.maxIncome': { $gte: normalizedIncome } },
      { 'eligibility.maxIncome': null }
    ];
  }
  return query;
};
const normalizeBusinessType = (value) => {
  if (!value) return null;
  const text = value.toLowerCase();
  if (['manufacturing', 'service', 'retail', 'agri'].includes(text)) return text;
  if (/farm|agri|dairy|livestock|fisher/.test(text)) return 'agri';
  if (/shop|retail|trade|store|commerce/.test(text)) return 'retail';
  if (/factory|manufactur|textile|food|construction/.test(text)) return 'manufacturing';
  if (/service|repair|transport|technology|software|education|health|tourism|hospital/.test(text)) return 'service';
  return null;
};
const seededDocuments = new Map(seedSchemes.map((scheme) => [scheme.name.en, scheme.documentsRequired]));
const withDocuments = (scheme) => {
  const value = typeof scheme.toObject === 'function' ? scheme.toObject() : scheme;
  if (value.documentsRequired?.length) return value;
  const documents = seededDocuments.get(englishText(value.name));
  return documents ? { ...value, documentsRequired: documents } : value;
};
const withDocumentsList = (schemes) => schemes.map(withDocuments);
const seedMatches = ({ category, state, businessType, income, age }) => seedSchemes.filter((scheme) => {
  const eligibility = scheme.eligibility || {};
  const normalizedCategory = normalizeCategory(category);
  const normalizedState = normalizeState(state);
  const normalizedBusinessType = normalizeBusinessType(businessType);
  const normalizedAge = normalizeAge(age);
  const normalizedIncome = normalizeIncome(income);
  const matchesCategory = !normalizedCategory || eligibility.category?.includes(normalizedCategory);
  const matchesState = !normalizedState || eligibility.states?.includes(normalizedState) || eligibility.states?.includes('All');
  const matchesBusinessType = !normalizedBusinessType || eligibility.businessType?.includes(normalizedBusinessType);
  const matchesAge = !normalizedAge || eligibility.minAge <= normalizedAge;
  const matchesIncome = normalizedIncome == null || !eligibility.maxIncome || eligibility.maxIncome >= normalizedIncome;
  return matchesCategory && matchesState && matchesBusinessType && matchesAge && matchesIncome;
});

// POST /api/match - hard filter + AI re-rank
router.post('/match', async (req, res) => {
  try {
    const { category, state, businessType, income, age, description } = req.body;
    const query = eligibilityQuery({ category, state, businessType, income, age });
    const matchedSchemes = await Scheme.find(query);

    // If no free-text description given, or no matches, skip AI re-ranking
    if (!description || matchedSchemes.length === 0) {
      return res.json(withDocumentsList(matchedSchemes));
    }

    // Call Python AI service to re-rank by relevance to description
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/rerank`, {
        userDescription: description,
        schemes: matchedSchemes.map((s) => ({
          id: s._id.toString(),
          name: englishText(s.name),
          description: englishText(s.description)
        }))
      }, { timeout: AI_TIMEOUT_MS });

      const ranked = aiResponse.data.ranked || [];

      // Reorder matchedSchemes based on AI ranking, attach reasons
      const schemeMap = new Map(matchedSchemes.map((s) => [s._id.toString(), s]));
      const orderedResults = ranked
        .map((r) => {
          const scheme = schemeMap.get(r.id);
          if (!scheme) return null;
          return { ...scheme.toObject(), matchReason: r.reason };
        })
        .filter(Boolean);

      // Fallback: if AI ranking lost some schemes, append any missing ones
      const rankedIds = new Set(ranked.map((r) => r.id));
      const missing = matchedSchemes.filter((s) => !rankedIds.has(s._id.toString()));

      return res.json(withDocumentsList([...orderedResults, ...missing]));
    } catch (aiError) {
      console.error('AI service error, falling back to unranked results:', aiError.message);
      return res.json(withDocumentsList(matchedSchemes));
    }
  } catch (err) {
    console.error('Database match failed, using seeded schemes:', err.message);
    res.json(withDocumentsList(seedMatches(req.body)));
  }
});

// GET /api/schemes - fetch all schemes, optionally filtered by a text search
router.get('/schemes', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { 'name.en': { $regex: search, $options: 'i' } },
          { 'description.en': { $regex: search, $options: 'i' } },
          { 'ministry.en': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const schemes = await Scheme.find(query);
    res.json(withDocumentsList(schemes));
  } catch (err) {
    const term = String(req.query.search || '').toLowerCase();
    const filtered = seedSchemes.filter((scheme) => [scheme.name, scheme.description, scheme.ministry]
      .map((field) => englishText(field).toLowerCase())
      .some((field) => !term || field.includes(term)));
    res.json(withDocumentsList(filtered));
  }
});

// GET /api/schemes/:id - fetch a single scheme by id
router.get('/schemes/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found.' });
    }
    res.json(withDocuments(scheme));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ error: 'Scheme not found.' });
    }
    console.error('SCHEME GET ERROR:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/schemes - create a new scheme and trigger new-scheme email notifications
router.post('/schemes', async (req, res) => {
  try {
    const { name, ministry, description, eligibility, benefits, applyLink, documentsRequired } = req.body;

    if (!name || !ministry || !description) {
      return res.status(400).json({ error: 'name, ministry, and description are required.' });
    }

    const formatLocalized = (val) => {
      if (!val) return { en: '' };
      if (typeof val === 'string') return { en: val.trim() };
      return {
        en: String(val.en || '').trim(),
        hi: String(val.hi || '').trim(),
        te: String(val.te || '').trim()
      };
    };

    const schemeName = formatLocalized(name);
    if (!schemeName.en) {
      return res.status(400).json({ error: 'Scheme English name is required.' });
    }

    const newScheme = await Scheme.create({
      name: schemeName,
      ministry: formatLocalized(ministry),
      description: formatLocalized(description),
      eligibility: {
        category: Array.isArray(eligibility?.category) ? eligibility.category : [],
        businessType: Array.isArray(eligibility?.businessType) ? eligibility.businessType : [],
        states: Array.isArray(eligibility?.states) ? eligibility.states : ['All'],
        minAge: Number(eligibility?.minAge) || 18,
        maxIncome: eligibility?.maxIncome != null ? Number(eligibility.maxIncome) : null,
        newOrExisting: eligibility?.newOrExisting || 'both'
      },
      benefits: {
        type: benefits?.type || 'grant',
        amount: formatLocalized(benefits?.amount)
      },
      applyLink: applyLink || '',
      documentsRequired: Array.isArray(documentsRequired)
        ? documentsRequired.map(formatLocalized)
        : []
    });

    // Notify users in background / fail-safe mode (never fails scheme creation)
    let notificationSummary = { notifiedCount: 0 };
    try {
      notificationSummary = await notifyUsersOfNewScheme(newScheme);
    } catch (notifErr) {
      console.error('Failed to trigger scheme notifications:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      scheme: withDocuments(newScheme),
      notifications: notificationSummary
    });
  } catch (err) {
    console.error('SCHEME CREATE ERROR:', err);
    res.status(500).json({ error: err.message || 'Failed to create scheme.' });
  }
});

// POST /api/smart-match - free text in, extract fields, then hard filter + rerank
router.post('/smart-match', async (req, res) => {
  try {
    const { freeText } = req.body;

    if (!freeText || freeText.trim().length < 10) {
      return res.status(400).json({ error: 'Please describe yourself and your business idea in a bit more detail.' });
    }

    let extracted;
    try {
      const extractResponse = await axios.post(`${AI_SERVICE_URL}/api/extract`, { freeText }, { timeout: AI_TIMEOUT_MS });
      extracted = extractResponse.data || {};
    } catch (extractError) {
      console.error('Extract service error:', extractError.message);
      return res.status(503).json({ error: 'The matching service is unavailable. Please try Find schemes with the form, or try again shortly.' });
    }

    if (extracted.error) {
      console.error('AI extraction internal service error:', extracted.error);
      return res.status(503).json({ error: 'The AI matching service is currently experiencing technical difficulties. Please try again shortly or use Find schemes with the form.' });
    }

    extracted = {
      ...extracted,
      category: normalizeCategory(extracted.category),
      state: normalizeState(extracted.state),
      businessType: normalizeBusinessType(extracted.businessType),
      age: normalizeAge(extracted.age),
      income: normalizeIncome(extracted.income)
    };

    if (!extracted.category && !extracted.state && !extracted.businessType && !extracted.age && extracted.income == null) {
      return res.status(400).json({ error: 'Please include details such as age, category, state, or business type so we can check eligibility.' });
    }

    const query = eligibilityQuery(extracted);
    const matchedSchemes = await Scheme.find(query);

    if (matchedSchemes.length === 0) {
      return res.json({ extracted, results: [] });
    }

    // Step 3: re-rank using the extracted description (or fall back to raw text)
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/rerank`, {
        userDescription: extracted.description || freeText,
        schemes: matchedSchemes.map((s) => ({
          id: s._id.toString(),
          name: englishText(s.name),
          description: englishText(s.description)
        }))
      });

      const ranked = aiResponse.data.ranked || [];
      const schemeMap = new Map(matchedSchemes.map((s) => [s._id.toString(), s]));
      const orderedResults = ranked
        .map((r) => {
          const scheme = schemeMap.get(r.id);
          if (!scheme) return null;
          return { ...scheme.toObject(), matchReason: r.reason };
        })
        .filter(Boolean);

      const rankedIds = new Set(ranked.map((r) => r.id));
      const missing = matchedSchemes.filter((s) => !rankedIds.has(s._id.toString()));

      return res.json({ extracted, results: withDocumentsList([...orderedResults, ...missing]) });
    } catch (aiError) {
      console.error('Rerank failed, returning unranked:', aiError.message);
      return res.json({ extracted, results: withDocumentsList(matchedSchemes) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/near-miss - find schemes that almost match, with AI explanation of the gap
router.post('/near-miss', async (req, res) => {
  try {
    const { category, state, businessType, income, age } = req.body;

    // Relaxed query: match category/state/businessType but ignore income/age entirely
    const relaxedQuery = {};
    if (category) relaxedQuery['eligibility.category'] = category;
    if (state) relaxedQuery['eligibility.states'] = { $in: [state, 'All'] };
    const normalizedBusinessType = normalizeBusinessType(businessType);
    if (normalizedBusinessType) relaxedQuery['eligibility.businessType'] = normalizedBusinessType;

    const relaxedMatches = await Scheme.find(relaxedQuery);

    // Strict query (same as /match) to know what already fully qualifies
    const strictQuery = { ...relaxedQuery };
    if (age) strictQuery['eligibility.minAge'] = { $lte: Number(age) };
    if (income) {
      strictQuery.$or = [
        { 'eligibility.maxIncome': { $gte: Number(income) } },
        { 'eligibility.maxIncome': null }
      ];
    }
    const strictMatches = await Scheme.find(strictQuery);
    const strictIds = new Set(strictMatches.map((s) => s._id.toString()));

    // Near-misses = relaxed matches that are NOT in the strict match set
    const nearMisses = relaxedMatches.filter((s) => !strictIds.has(s._id.toString()));

    if (nearMisses.length === 0) {
      return res.json({ gaps: [] });
    }

    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/gap-explainer`, {
        userProfile: { age, category, state, businessType, income },
        nearMissSchemes: nearMisses.map((s) => ({
          id: s._id.toString(),
          name: englishText(s.name),
          description: englishText(s.description)
        }))
      });

      const gaps = aiResponse.data.gaps || [];
      const schemeMap = new Map(nearMisses.map((s) => [s._id.toString(), s]));

      const results = gaps
        .map((g) => {
          const scheme = schemeMap.get(g.id);
          if (!scheme) return null;
          return { ...scheme.toObject(), gapExplanation: g.explanation };
        })
        .filter(Boolean);

      return res.json({ gaps: results });
    } catch (aiError) {
      console.error('Gap explainer AI call failed:', aiError.message);
      return res.json({ gaps: withDocumentsList(nearMisses) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scheme-image?query=manufacturing - fetch a relevant photo from Unsplash
router.get('/scheme-image', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'query is required.' });
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, per_page: 1, orientation: 'landscape' },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    const photo = response.data.results[0];
    if (!photo) {
      return res.json({ imageUrl: null });
    }

    res.json({
      imageUrl: photo.urls.regular,
      photographerName: photo.user.name,
      photographerUrl: photo.user.links.html
    });
  } catch (err) {
    console.error('Unsplash fetch failed:', err.message);
    res.json({ imageUrl: null }); // fail gracefully, never break the page
  }
});

module.exports = router;