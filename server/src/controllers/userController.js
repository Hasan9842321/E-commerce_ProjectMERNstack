// http-error hanland 
const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');



const { findWithId } = require('../services/findItem');
const deleteImage = require('../helper/deleteImage');
const { jwtActivationKey, clintUrl } = require('../secret');
const { emailWithNodeEmailer } = require('../helper/email');
const { createJSONWEBToken } = require('../helper/jsonwebtoken');
// const findUserById = require('../services/findUser');

const getAllUsers = async(req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegExp = new RegExp('.*' + search + '.*', 'i'); // reguler expression for searching 
        // condition set based on reguler expression
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ]
        };

        const options = { password: 0 } // condition set for reason Admin  have not need users password

        const users = await User.find(filter, options).limit(limit) // Admin find users based on condition 
            .skip((page - 1) * limit);

        const count = await User.find(filter).countDocuments();

        //worst-case:if no users found then http error will be called
        if (!users) throw createError(404, "no users found");

        return successResponse(
            res, {
                statusCode: 200,
                message: 'users are returned',
                paylod: {
                    users, // users return 
                    // pagination added 
                    pagination: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
                }
            }

        )

    } catch (error) {
        next(error);
    }
};

const getUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);

        return successResponse(
            res, {
                statusCode: 200,
                message: 'user  are returned',
                paylod: { user }
            });

    } catch (error) {

        next(error);
    }
};

const deleteUserById = async(req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);

        //user image deleate 
        const userImagePath = user.image;

        deleteImage(userImagePath);


        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false
        });

        return successResponse(
            res, {
                statusCode: 200,
                message: 'user was  deleted succesfully'

            });

    } catch (error) {

        next(error);
    }
};

const processRegister = async(req, res, next) => {
    try {

        const { name, email, password, phone, address } = req.body;
        const userExist = await User.exists({ email: email });

        if (userExist) {
            throw createError(409, "User with this email already exist.Please login or Sign in");
        }

        //create JWT
        const token = createJSONWEBToken({ name, email, password, phone, address }, jwtActivationKey, { expiresIn: '10m' });
        // console.log("token: ", token);

        //prepare email with nodeemailer

        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
                <h2>Hello ${name}</h2>
                <p> please click here to  thik link <a href="${clintUrl}/api/users/activate/${token}" target="_blank"> activate your account </a> </p>
                `
        }

        // send email with nodeEmailer
        try {

            await emailWithNodeEmailer(emailData);
        } catch (emailError) {
            next(createError(500, 'Faild to send varification email'));
            return;

        }

        return successResponse(
            res, {
                statusCode: 200,
                // message: `Please go to your ${email} for completing your registration process`,
                message: 'user are created',
                paylod: { token },

            });


    } catch (error) {

        next(error);
    }
};

module.exports = { getAllUsers, getUserById, deleteUserById, processRegister };