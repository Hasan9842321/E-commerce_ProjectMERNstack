const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const User = require('../models/userModel');
const { successResponse } = require('./responseController')

const { createJSONWEBToken } = require('../helper/jsonwebtoken');
const { JwtAccessKey } = require('../secret');


const handleLogin = async(req, res, next) => {
    try {
        //email ,password
        const { email, password } = req.body;
        //isExist
        const user = await User.findOne({ email })

        if (!user) {
            throw createError(
                422,
                "user doesnot exist with this eamil. please register first");
        };
        //compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            throw createError(401, "Emil/Password did not match");

        }
        //isBanned
        if (user.isBanned) {
            throw createError(403, "you are banned,Please contact Authority")

        }


        //token, cookie

        const accessToken = createJSONWEBToken({ user },
            JwtAccessKey, '15m'
        );

        //cookie
        res.cookie('access_token', ccessToken, {
            maxAge: 15 * 60 * 1000, //15 minutes
            httpOnly: true,
            // secure: true,
            sameSite: 'none',
        })


        const userWithoutPassword = await User.findOne({ email }).select('-password');

        //success response
        return successResponse(res, {
                statusCode: 200,
                message: 'user  loggeding successfully',
                paylod: { userWithoutPassword }
            }

        );
    } catch (error) {
        next(error)
    }
}

const handleLogout = async(req, res, next) => {
    try {

        res.clearCookie('accessToken')



        //success response
        return successResponse(res, {
                statusCode: 200,
                message: 'user  loggout successfully',
                paylod: {}
            }

        );
    } catch (error) {
        next(error)
    }
}
module.exports = { handleLogin, handleLogout };