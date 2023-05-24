const User = require('../models/userModel');
const data = require('../data');

const seedUser = async(req, res, next) => {
    try {
        //deleting all existing users
        await User.deleteMany({});

        //insert new existing users
        const user = await User.insertMany(data.users);

        // successful response
        return res.status(201).json(data.users);

    } catch (error) {
        next(error);
    }
}

module.exports = { seedUser };