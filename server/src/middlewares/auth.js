const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { JwtAccessKey } = require('../secret');

const isLoggedIn = (req, res, next) => {
    try {

        const token = req.cookies.accessToken;

        if (!token) {
            throw createError(401, "Access Token not found")
        }
        const decoded = jwt.verify(token, JwtAccessKey);

        if (!decoded) {
            throw createError(401, 'Invalid Access Token, Please login again')
        }
        req.body.userId = decoded._id;
        next()

    } catch (error) {

    }
}

module.exports = { isLoggedIn }