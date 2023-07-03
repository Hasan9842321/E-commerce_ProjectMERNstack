const express = require('express');
const { getAllUsers, getUserById, deleteUserById, processRegister, activateUserAccount } = require('../controllers/userController');
const { upload } = require('../middlewares/uploadFile');
const { runValidation } = require('../validators');
const { validateUserRegistration } = require('../validators/auth');

const userRouter = express.Router();



//api/users 
userRouter.get("/", getAllUsers);
userRouter.post('/process-register', upload.single('image'), validateUserRegistration, runValidation, processRegister);
userRouter.post('/verify', activateUserAccount);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;