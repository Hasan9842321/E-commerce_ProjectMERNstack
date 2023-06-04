require('dotenv').config(); // require config 

const serverPort = process.env.SERVER_PORT || 500;

const mongoDbUrll = (process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecommerceMernBD');

const defaultImagePath = 'public/images/users/men.png';

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY;

module.exports = { serverPort, mongoDbUrll, defaultImagePath, jwtActivationKey };

// process.env.DEFAULT_IMAGE_PATH ||