const express = require('express');
const router = express.Router();
const damageController = require('../controllers/damageController');
const upload = require('../middleware/upload');

router.post('/analyze', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), damageController.analyzeDamage);

router.get('/history', damageController.getHistory);
router.get('/:id', damageController.getDamageAnalysisById);

module.exports = router;
