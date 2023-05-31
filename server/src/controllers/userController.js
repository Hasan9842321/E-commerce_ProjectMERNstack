// http-error hanland 
const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const fs = require('fs');


const { findWithId } = require('../services/findItem');
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


const getUser = async(req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(id, options);

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

const deleteUser = async(req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(id, options);

        // deleate user
        const deleatedUesr = await User.findByIdAndDelete({
            _id: id,
            isAdmin: false
        });

        if (!deleteUser) {
            console.log("user doesnot exist");
        }


        //user image deleate 
        const userImagePath = deleatedUesr.image;
        fs.access(userImagePath, (err) => {
            if (err) {
                console.log("user image doesnot exist");
            } else {
                fs.unlink(userImagePath, (err) => {
                    if (err) throw err;
                    console.log("user image was deleated");
                })
            }
        })


        return successResponse(
            res, {
                statusCode: 200,
                message: 'user was  deleted succesfully'

            });

    } catch (error) {

        next(error);
    }
};
module.exports = { getAllUsers, getUser, deleteUser };