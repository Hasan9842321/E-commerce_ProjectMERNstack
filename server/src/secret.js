require('dotenv').config(); // require config 

const serverPort = process.env.SERVER_PORT || 500;

const mongoDbUrll = (process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecommerceMernBD');

module.exports = { serverPort, mongoDbUrll };