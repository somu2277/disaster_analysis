const DamageAnalysis = require('../models/DamageAnalysis');
const geminiDamageService = require('../services/geminiDamageService');

exports.analyzeDamage = async (req, res, next) => {
  try {
    if (!req.files || !req.files['beforeImage'] || !req.files['afterImage']) {
      return res.status(400).json({ message: 'Please upload both BEFORE and AFTER images.' });
    }

    const beforeImagePath = req.files['beforeImage'][0].path;
    const afterImagePath = req.files['afterImage'][0].path;

    // Call Gemini Service
    const aiResult = await geminiDamageService.analyzeDamage(beforeImagePath, afterImagePath);

    // Save to MongoDB
    const analysis = new DamageAnalysis({
      beforeImagePath: beforeImagePath.replace(/\\/g, '/'),
      afterImagePath: afterImagePath.replace(/\\/g, '/'),
      totalBuildings: aiResult.totalBuildings,
      damagedBuildings: aiResult.damagedBuildings,
      noDamage: aiResult.damageDistribution.noDamage,
      lowDamage: aiResult.damageDistribution.low,
      mediumDamage: aiResult.damageDistribution.medium,
      highDamage: aiResult.damageDistribution.high,
      uncertain: aiResult.damageDistribution.uncertain,
      overallDamageRate: aiResult.overallDamageRate,
      buildings: aiResult.buildings
    });

    try {
      await analysis.save();
    } catch (dbError) {
      console.warn("Could not save to MongoDB (likely IP whitelist issue):", dbError.message);
    }

    res.status(201).json(analysis);
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await DamageAnalysis.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.warn("MongoDB error on history fetch, returning empty:", error.message);
    res.json([]);
  }
};

exports.getDamageAnalysisById = async (req, res, next) => {
  try {
    const analysis = await DamageAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};
