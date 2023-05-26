// http-error hanland 
const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { default: mongoose } = require('mongoose');
const { findUserById } = require('../services/findUser');
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


        // res.status(200).send({
        //     message: 'users are returned',
        //     users, // users return 
        //     // pagination added 
        //     pagination: Math.ceil(count / limit),
        //     currentPage: page,
        //     previousPage: page - 1 > 0 ? page - 1 : null,
        //     nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        // });

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


const getUser = async(req, res, next) => {
    try {
        const id = req.params.id;
        // const options = { password: 0 };

        // const user = await User.findById(id, options);
        // //worst-case:if user not found
        // if (!users) throw createError(404, "user doesnot exist");

        const user = await findUserById(id);
        return successResponse(
            res, {
                statusCode: 200,
                message: 'user  are returned',
                paylod: { user }
            });

    } catch (error) {
        // //mongoose erroe handal
        // if (error instanceof mongoose.Error) {
        //     next(createError(404, "Invalid user id"));
        //     return;
        // }
        next(error);
    }
};
module.exports = { getAllUsers, getUser };

// module.exports = getUesrs;