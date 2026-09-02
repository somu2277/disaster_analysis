const ThermalAnalysis = require('../models/ThermalAnalysis');
const geminiThermalService = require('../services/geminiThermalService');

exports.analyzeThermalImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a thermal image.' });
    }

    const imagePath = req.file.path;
    
    // Call Gemini Service
    const aiResult = await geminiThermalService.analyzeThermal(imagePath);

    // Save to MongoDB
    const analysis = new ThermalAnalysis({
      imagePath: imagePath.replace(/\\/g, '/'), // normalize path for frontend
      peopleDetected: aiResult.peopleDetected,
      people: aiResult.people,
      overallStatus: aiResult.overallStatus,
      aiExplanation: aiResult.aiExplanation
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
    const history = await ThermalAnalysis.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.warn("MongoDB error on history fetch, returning empty:", error.message);
    res.json([]);
  }
};

exports.getThermalAnalysisById = async (req, res, next) => {
  try {
    const analysis = await ThermalAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};
