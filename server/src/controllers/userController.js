// http-error hanland 
const createError = require('http-errors');
const User = require('../models/userModel');


const getUesrs = async(req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 1;

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

        //if no users found then http error will be called
        if (!users) throw createError(404, "no users found");


        res.status(200).send({
            message: 'users are returned',
            users, // users return 
            // pagination added 
            pagination: Math.ceil(count / limit),
            currentPage: page,
            previousPage: page - 1 > 0 ? page - 1 : null,
            nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
        });

    } catch (error) {
        next(error);
    }
}

module.exports = getUesrs;