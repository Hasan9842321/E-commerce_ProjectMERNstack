const express = require('express');

const runValidation = require('../validators');
const { errorResponse } = require('../controllers/responseController');
const { handleLogin } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/login', handleLogin);

module.exports = { authRouter };