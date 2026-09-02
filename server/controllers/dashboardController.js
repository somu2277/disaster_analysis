const ThermalAnalysis = require('../models/ThermalAnalysis');
const DamageAnalysis = require('../models/DamageAnalysis');

exports.getStats = async (req, res, next) => {
  try {
    const thermalCount = await ThermalAnalysis.countDocuments();
    const damageCount = await DamageAnalysis.countDocuments();
    
    // Aggregations for thermal
    const thermalStats = await ThermalAnalysis.aggregate([
      { $group: { _id: null, totalPeopleDetected: { $sum: '$peopleDetected' } } }
    ]);
    
    // Aggregations for damage
    const damageStats = await DamageAnalysis.aggregate([
      { $group: { 
          _id: null, 
          totalBuildingsAnalyzed: { $sum: '$totalBuildings' },
          totalDamaged: { $sum: '$damagedBuildings' },
          totalHighDamage: { $sum: '$highDamage' },
          avgDamageRate: { $avg: '$overallDamageRate' }
        }
      }
    ]);

    const stats = {
      thermalAnalyses: thermalCount,
      damageAnalyses: damageCount,
      peopleDetected: thermalStats[0]?.totalPeopleDetected || 0,
      buildingsAnalyzed: damageStats[0]?.totalBuildingsAnalyzed || 0,
      damagedBuildings: damageStats[0]?.totalDamaged || 0,
      highDamageBuildings: damageStats[0]?.totalHighDamage || 0,
      averageDamageRate: damageStats[0]?.avgDamageRate ? damageStats[0].avgDamageRate.toFixed(1) : 0
    };

    res.json(stats);
  } catch (error) {
    console.warn("MongoDB error on stats fetch, returning fallback demo data:", error.message);
    res.json({
      thermalAnalyses: 0,
      damageAnalyses: 0,
      peopleDetected: 0,
      buildingsAnalyzed: 0,
      damagedBuildings: 0,
      highDamageBuildings: 0,
      averageDamageRate: 0,
      demoMode: true
    });
  }
};
