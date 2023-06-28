const express = require('express');
const { getAllUsers, getUserById, deleteUserById, processRegister, activateUserAccount } = require('../controllers/userController');
const userRouter = express.Router();

//api/users 
userRouter.get("/", getAllUsers);
userRouter.post('/process-register', processRegister);
userRouter.post('/verify', activateUserAccount);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;