 const mongoose = require('mongoose');
 // http-error hanland 
 const createError = require('http-errors');
 


 //  const User = require('../models/userModel');

 const findWithId = async(Model, id, options = {}) => {
     try {
         //  const options = { password: 0 };
         const item = await Model.findById(id, options);
         //worst-case:if user not found
         if (!item) {
             throw createError(404, `${Model.modelName} does not exist with this id`);
         }
         return item;
     } catch (error) {
         //mongoose erroe handal
         if (error instanceof mongoose.Error) {
             throw createError(404, "Invalid item id");
         }
         throw error;
     }
 };

 module.exports = { findWithId };