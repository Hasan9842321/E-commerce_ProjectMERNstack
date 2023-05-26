const express = require('express');
const { getAllUsers, getUser } = require('../controllers/userController');
const userRouter = express.Router();

//api/users 
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);


module.exports = userRouter;