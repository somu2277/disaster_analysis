const express = require('express');
const router = express.Router();
const thermalController = require('../controllers/thermalController');
const upload = require('../middleware/upload');

router.post('/analyze', upload.single('image'), thermalController.analyzeThermalImage);
router.get('/history', thermalController.getHistory);
router.get('/:id', thermalController.getThermalAnalysisById);

module.exports = router;
