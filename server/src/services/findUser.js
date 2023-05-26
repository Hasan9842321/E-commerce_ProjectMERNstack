 const mongoose = require('mongoose');
 // http-error hanland 
 const createError = require('http-errors');
 const User = require('../models/userModel');

 const findUserById = async(id) => {
     try {
         const options = { password: 0 };
         const user = await User.findById(id, options);
         //worst-case:if user not found
         if (!user) {
             throw createError(404, "user doesnot exist");
         }
         return user;
     } catch (error) {
         //mongoose erroe handal
         if (error instanceof mongoose.Error) {
             throw createError(404, "Invalid user id");
         }
         throw error;
     }
 };

 module.exports = { findUserById };