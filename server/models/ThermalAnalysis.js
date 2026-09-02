const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  temperature: { type: Number, default: null },
  temperatureAvailable: { type: Boolean, default: false },
  status: { type: String, enum: ['normal', 'elevated', 'attention', 'unknown'], default: 'unknown' },
  confidence: { type: Number, required: true },
  bodyRegion: { type: String, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

const ThermalAnalysisSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  peopleDetected: { type: Number, required: true, default: 0 },
  people: [PersonSchema],
  overallStatus: { type: String, default: 'normal' },
  aiExplanation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ThermalAnalysis', ThermalAnalysisSchema);
