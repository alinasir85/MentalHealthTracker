const express = require('express');
const {googleAuth, logout} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/google', googleAuth);
router.post('/logout', authMiddleware, logout);

module.exports = router;
