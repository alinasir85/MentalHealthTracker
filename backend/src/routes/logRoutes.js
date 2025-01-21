const express = require('express');
const {addLog, getLogs} = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addLog);
router.get('/', authMiddleware, getLogs);

module.exports = router;
