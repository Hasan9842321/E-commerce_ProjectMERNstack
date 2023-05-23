require('dotenv').config(); // require config 

const serverPort = process.env.SERVER_PORT || 500;

const mongoDbUrll = (process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecommerceMernBD');

const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || 'public/images/users/men.png';

module.exports = { serverPort, mongoDbUrll, defaultImagePath };