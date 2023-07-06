require('dotenv').config(); // require config 

const serverPort = process.env.SERVER_PORT || 500;

const mongoDbUrll = (process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecommerceMernBD');

const defaultImagePath = 'public/images/users/men.png';

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'sdgfdb--dfge-asegfw';
const JwtAccessKey = process.env.JWT_ACCESS_KEY || 'ghvghcvyuviutyxryxry';

const smtpUsername = process.env.SMTP_USERNAME || '';
const smtPassword = process.env.SMTP_PASSWORD || '';

const clintUrl = process.env.CLINT_URL || '';

module.exports = { serverPort, mongoDbUrll, defaultImagePath, jwtActivationKey, JwtAccessKey, smtpUsername, smtPassword, clintUrl };

// process.env.DEFAULT_IMAGE_PATH ||