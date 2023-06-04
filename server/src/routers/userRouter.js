const express = require('express');
const { getAllUsers, getUserById, deleteUserById, processRegister } = require('../controllers/userController');
const userRouter = express.Router();

//api/users 
userRouter.get("/", getAllUsers);
userRouter.post('/process-register', processRegister);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;