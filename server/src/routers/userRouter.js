const express = require('express');
const { getAllUsers, getUserById, deleteUserById, processRegisters, activateUserAccount, updateUserById } = require('../controllers/userController');
const { upload } = require('../middlewares/uploadFile');
const { runValidation } = require('../validators');
const { validateUserRegistrations } = require('../validators/auth');
const { isLoggedIn } = require('../middlewares/auth');



const userRouter = express.Router();


// upload.array('image', 1)
//api/users 


userRouter.post('/process-register', upload.single('image'), validateUserRegistrations, runValidation, processRegisters);
userRouter.post('/verify', activateUserAccount);

userRouter.get("/", isLoggedIn, getAllUsers); //Accessable for only Admin
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put("/:id", upload.single("image"), isLoggedIn, updateUserById);

module.exports = userRouter;