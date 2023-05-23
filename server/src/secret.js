require('dotenv').config();// require config 

const serverPort = process.env.SERVER_PORT || 500;

module.exports = serverPort;
