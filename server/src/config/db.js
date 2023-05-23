const mongoose = require('mongoose');
const { mongoDbUrll } = require('../secret');
// const mongoClient = require('mongodb').MongoClient;

// const mongoDbUrl = require('../secret');

const connectDatabase = async(options = {}) => {

    try {
        await mongoose.connect(mongoDbUrll, options);
        console.log("MongoDB connect successfully");

        mongoose.connection.on('error', (error) => {
            console.error('DB connection error: ', error);
        })
    } catch (error) {
        console.error('Couldnot connected to Db ', error.toString());
    }


};

module.exports = connectDatabase;