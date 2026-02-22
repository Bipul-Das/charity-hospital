const express = require('express');
const { getPublicStats, submitMessage } = require('../controllers/publicController');

const router = express.Router();

router.get('/stats', getPublicStats);
router.post('/contact', submitMessage); // <--- NEW ROUTE

module.exports = router;