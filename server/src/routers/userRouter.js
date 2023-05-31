const express = require('express');
const { getAllUsers, getUser, deleteUser } = require('../controllers/userController');
const userRouter = express.Router();

//api/users 
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUser);
userRouter.delete("/:id", deleteUser);


module.exports = userRouter;