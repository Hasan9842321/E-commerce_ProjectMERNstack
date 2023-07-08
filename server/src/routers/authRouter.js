const express = require('express');

const { validateUserLogin } = require('../validators/auth');
const { runValidation } = require('../validators');
const { errorResponse } = require('../controllers/responseController');
const { handleLogin, handleLogout } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');


const authRouter = express.Router();

authRouter.post(
    '/login',
    validateUserLogin,
    runValidation,
    isLoggedOut,
    handleLogin);
authRouter.post('/logout', isLoggedIn, handleLogout)

module.exports = { authRouter };