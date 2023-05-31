const express = require('express');
const { getAllUsers, getUserById, deleteUserById } = require('../controllers/userController');
const userRouter = express.Router();

//api/users 
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);


module.exports = userRouter;