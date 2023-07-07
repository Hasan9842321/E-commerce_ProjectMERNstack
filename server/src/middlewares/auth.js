const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { JwtAccessKey } = require('../secret');

const isLoggedIn = async(req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw createError(401, "Access Token not found")
        }
        const decoded = jwt.verify(accessToken, JwtAccessKey);

        if (!decoded) {
            throw createError(401, 'Invalid Access Token, Please login again')
        }
        req.body.userId = decoded._id;
        next()

    } catch (error) {

    }
}

const isLoggedOut = async(req, res, next) => {
    try {


        const accessToken = req.cookies.accessToken;

        if (accessToken) {
            throw createError(400, "user is already loggedIn");
        }
        next()
    } catch (error) {
        return next(error);
    }

}

module.exports = { isLoggedIn, isLoggedOut }