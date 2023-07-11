// http-error hanland 
const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
    // const { runValidation } = require('../validators');


const { findWithId } = require('../services/findItem');
const deleteImage = require('../helper/deleteImage');
const { jwtActivationKey, clintUrl, jwtResetPasswordkey } = require('../secret');
const { emailWithNodeEmailer } = require('../helper/email');
const { createJSONWEBToken } = require('../helper/jsonwebtoken');
const { runValidation } = require('../validators');
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
        // const userImagePath = user.image;

        // deleteImage(userImagePath);


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

const processRegisters = async(req, res, next) => {



    // console.log({ name, email, password, phone, address })
    // console.log(file)

    try {


        const { name, email, password, phone, address } = req.body;

        const image = req.file;

        if (!image) {
            throw createError(400, `img file is require high;ly${file}`);
        }

        if (image.size > 1024 * 1024 * 2) {
            throw new Error(`file size is too lerge.It must be 2 mb`);
        }
        const imageBufferString = image.buffer.toString('base64')



        const userExist = await User.exists({ email: email });

        if (userExist) {
            throw createError(409, "User with this email already exist.Please login or Sign in");
        }

        //create JWT
        const token = createJSONWEBToken({ name, email, password, phone, address, image: imageBufferString }, jwtActivationKey, { expiresIn: '10m' });
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
                message: `Please go to your ${email} for completing your registration process`,
                // message: 'user are created',
                paylod: { token },

            });


    } catch (error) {

        next(error);
    }
};

const activateUserAccount = async(req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) throw createError(404, "token not created");


        try {

            const decoded = jwt.verify(token, jwtActivationKey);
            if (!decoded) throw createError(401, 'unable to verify token');


            //if Duplicate  tiken create 
            const userTookenExist = await User.exists({ email: decoded.email })

            if (userTookenExist) {
                throw createError(409, "User token with this email already exist.Please login or Sign in");


            }
            // user will create by token verification
            await User.create(decoded);

            return successResponse(
                res, {
                    statusCode: 200,
                    message: 'user are register Successfully',


                });

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'Token has expired')
            } else if (error.name === 'jsonWebTokenError') {
                throw createError(401, 'Invalid Token');
            } else {
                throw error;
            }
        }
    } catch (error) {

        next(error);
    }
};


const updateUserById = async(req, res, next) => {
    try {
        const userId = req.params.id;
        const options = { password: 0 };
        await findWithId(User, userId, options);

        const updateOptions = { new: true, runValidators: true, contex: 'query' };
        let updates = {};

        // if (req.body.name) {
        //     updates.name = req.body.name;
        // }
        // if (req.body.password) {
        //     updates.password = req.body.password;
        // }
        // if (req.body.phone) {
        //     updates.phone = req.body.phone;
        // }
        // if (req.body, address) {
        //     updates.address = req.body.address;
        // }

        for (let key in req.body) {
            if (['name', 'password', 'phone', 'address'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['email'].includes(key)) {
                throw new Error('Emil can not be update');
            }

        }

        const image = req.file;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw new Error(`file size is too lerge.It must be 2 mb`);
            }
            updates.image = image.buffer.toString('base64');
        }




        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password");

        if (!updatedUser) {
            throw createError(404, "user id doesnot exist");
        }



        return successResponse(
            res, {
                statusCode: 200,
                message: 'user was  updated succesfully',
                paylod: updatedUser

            });

    } catch (error) {

        next(error);
    }
};


const handleBanUserById = async(req, res, next) => {
    try {
        const userId = req.params.id;
        await findWithId(User, userId);
        const updates = { isBanned: true };
        const updateOptions = { new: true, runValidators: true, contex: 'query' }


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions,
        ).select('-password');

        if (!updatedUser) {
            throw createError(404, "user was not bann successfully")
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'user was banned successfully'
        })
    } catch (error) {
        next(error)
    }
};

const handleUnBanUserById = async(req, res, next) => {
    try {
        const userId = req.params.id;
        await findWithId(User, userId);
        const updates = { isBanned: false };
        const updateOptions = { new: true, runValidators: true, contex: 'query' }


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions,
        ).select('-password');

        if (!updatedUser) {
            throw createError(404, "user was not Unbanned successfully")
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'user was Unbanned successfully.'
        })
    } catch (error) {
        next(error)
    }
};

const handleUpdatePassword = async(req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.params.id;
        const user = await findWithId(User, userId);

        //compare the password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) {
            throw createError(400, "oldPassword did not match");
        }
        //update password
        const filter = { userId }
        const update = { $set: { password: newPassword } }
        const updateOptions = { new: true }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            user,
            updateOptions
        ).select('-password')

        //not update
        if (!updatedUser) {
            throw createError(400, "User was not ")
        }


        return successResponse(res, {
            statusCode: 200,
            message: "user was updated ",
            paylod: { user }
        });

    } catch (error) {
        next(error);
    }
};

const handleForgetPassword = async(req, res, next) => {
    try {
        const { email } = req.body;
        const userData = await user.findOne({ email: email });
        if (!userData) {
            throw createError(404, "Email is incorrect or you have not verified your email.Please register yourself first");
        }

        //create JWT
        const token = createJSONWEBToken({ email }, jwtResetPasswordkey, { expiresIn: '10m' });

        //prepare email with nodeemailer
        const emailData = {
            email,
            subject: 'Reset password Email',
            html: `
                 <h2>Hello ${userData.name}</h2>
                 <p> please click here to  thik link <a href="${clintUrl}/api/users/reset-password/${token}" target="_blank"> reset your password</a> </p>
                 `
        }

        // send email with nodeEmailer
        try {

            await emailWithNodeEmailer(emailData);
        } catch (emailError) {
            next(createError(500, 'Faild to send reset password  email'));
            return;

        }

        return successResponse(
            res, {
                statusCode: 200,
                message: `Please go to your ${email} for reseting the password`,
                paylod: { token },


            });


    } catch (error) {
        next(error);
    }
};

const handleResetPassword = async(req, res, next) => {
    try {
        const { token, password } = req.body;
        const decode = jwt.verify(token, jwtResetPasswordkey);

        if (!decode) {
            throw createError(400, "invalid or expire token");
        }

        //update password
        const filter = { email: decode.email };
        const update = { password: newPassword };
        const updateOptions = { new: true };
        const updatedUser = await User.findOneAndUpdate(
            filter,
            update,
            updateOptions,
        ).select('-password');

        if (!updatedUser) {
            throw createError(400, "Password reset failed")
        }

        return successResponse(
            res, {
                statusCode: 200,
                message: `password reset successfully`,

            });

    } catch (error) {
        next(error)
    }
}




module.exports = {
    getAllUsers,
    getUserById,
    deleteUserById,
    processRegisters,
    activateUserAccount,
    updateUserById,
    handleBanUserById,
    handleUnBanUserById,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword,
};