const express = require('express');
const { getAllUsers, getUserById, deleteUserById, processRegisters, activateUserAccount, updateUserById } = require('../controllers/userController');
const { upload } = require('../middlewares/uploadFile');
const { runValidation } = require('../validators');
const { validateUserRegistrations } = require('../validators/auth');



const userRouter = express.Router();


// upload.array('image', 1)
//api/users 
userRouter.get("/", getAllUsers);
userRouter.post('/process-register', upload.single('image'), validateUserRegistrations, runValidation, processRegisters);
userRouter.post('/verify', activateUserAccount);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put("/:id", upload.single("image"), updateUserById);

module.exports = userRouter;