const { validationResult } = require('express-validator');
const { errorResponse } = require('../controllers/responseController');

const runValidation = async(req, res, next) => {
    try {

        const errors = validationResult(req);
        //if error not empty or exist 
        if (!errors.isEmpty()) {
            // return errorResponse(422, errors.array[0])
            // console.log();
            return errorResponse(res, {
                statusCode: 422,
                message: errors.array()[0].msg,
            });
        }


    } catch (error) {
        return next(error);
    }
}

module.exports = { runValidation };