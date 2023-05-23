const { connect } = require('mongoose');
const app = require('./app');
const { serverPort } = require('./secret');
// const connectDb = require('./config/db');
const connectDatabase = require('./config/db');
// const serverPort = require('./secret');
// const connectDb = require('./config/db');

app.listen(serverPort, async() => {

    console.log(`server is tunning at http://localhost:${serverPort}`);
    await connectDatabase();



});