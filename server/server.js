const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Scheme = require('./models/Scheme');
const seedSchemes = require('./data/seedSchemes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', (req, res, next) => {
  const readOnlySchemeRequest = req.path === '/match'
    || req.path === '/smart-match'
    || req.path === '/near-miss'
    || req.path === '/schemes'
    || req.path.startsWith('/schemes/')
    || req.path === '/scheme-image';

  if (mongoose.connection.readyState !== 1 && !readOnlySchemeRequest) {
    return res.status(503).json({ error: 'The data service is temporarily unavailable. Please try again shortly.' });
  }
  next();
});

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000
})
  .then(async () => {
    console.log('MongoDB connected');

    const schemes = await Scheme.find({}, { name: 1, documentsRequired: 1 });
    const seededByName = new Map(seedSchemes.map((scheme) => [scheme.name.en, scheme.documentsRequired]));
    let repaired = 0;

    for (const scheme of schemes) {
      const documents = seededByName.get(scheme.name?.en);
      if (documents && (!scheme.documentsRequired || scheme.documentsRequired.length === 0)) {
        await Scheme.updateOne({ _id: scheme._id }, { $set: { documentsRequired: documents } });
        repaired += 1;
      }
    }

    if (repaired > 0) console.log(`Repaired document lists for ${repaired} schemes`);
  })
  .catch((err) => console.error('MongoDB connection error:', err));

const schemeRoutes = require('./routes/schemeRoutes');
app.use('/api', schemeRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const bookmarkRoutes = require('./routes/bookmarkRoutes');
app.use('/api/bookmarks', bookmarkRoutes);

const historyRoutes = require('./routes/historyRoutes');
app.use('/api/history', historyRoutes);

const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);

const applicationRoutes = require('./routes/applicationRoutes');
app.use('/api/applications', applicationRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
  res.send('SchemeSetu API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});