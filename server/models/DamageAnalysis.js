const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema({
  buildingId: { type: Number, required: true },
  damageLevel: { 
    type: String, 
    enum: ['NO DAMAGE', 'LOW', 'MEDIUM', 'HIGH', 'UNCERTAIN'],
    required: true 
  },
  damageRate: { type: Number, required: true },
  confidence: { type: Number, required: true },
  reason: { type: String, required: true },
  boundingBox: {
    // Optional bounding box coords [ymin, xmin, ymax, xmax] format normalized 0-1
    ymin: Number,
    xmin: Number,
    ymax: Number,
    xmax: Number
  }
}, { _id: false });

const DamageAnalysisSchema = new mongoose.Schema({
  beforeImagePath: { type: String, required: true },
  afterImagePath: { type: String, required: true },
  totalBuildings: { type: Number, default: 0 },
  damagedBuildings: { type: Number, default: 0 },
  noDamage: { type: Number, default: 0 },
  lowDamage: { type: Number, default: 0 },
  mediumDamage: { type: Number, default: 0 },
  highDamage: { type: Number, default: 0 },
  uncertain: { type: Number, default: 0 },
  overallDamageRate: { type: Number, default: 0 },
  buildings: [BuildingSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DamageAnalysis', DamageAnalysisSchema);
