const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', userController.getUserProfile);
router.put('/portfolio', protect, userController.updatePortfolio);
router.get('/:id/portfolio', userController.getPortfolio);

module.exports = router;
