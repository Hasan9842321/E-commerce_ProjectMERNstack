const express = require('express');
const userRouter = express.Router();

const getUesrs = require('../controllers/userController');

//api/users 
userRouter.get("/", getUesrs);


module.exports = userRouter;