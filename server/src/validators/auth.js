const { body } = require("express-validator");

//registration validation
const validateUserRegistration = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("name is required, enter your full name")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name Should be at least 3-31 characters long"),

    body('email')
    .trim()
    .notEmpty()
    .withMessage("email is required, enter your email address")
    .isEmail()
    .withMessage("Invalid Email address"),

    body('password')
    .trim()
    .notEmpty()
    .withMessage("Password is required, enter your password")
    .isLength({ min: 6 })
    .withMessage("Password Should be at least 6 characters long")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d) (?=.*[@$ !%*?&]) [A - Za - z\ d @$! % * ? & ] + $ /
    )
    .withMessage(
        'Password should contain at least uppercase letter, one lowercase letter, one number, and one special character.'
    ),


    body('address')
    .trim()
    .notEmpty()
    .withMessage("Address is required, enter your address")
    .isLength({ min: 3 })
    .withMessage("address Should be at least 3 characters long"),

    body('phone')
    .trim()
    .notEmpty()
    .withMessage("phone number  is required, enter your phone"),

    body('image')
    .optional()
    .isString()





];
// Singn in validation 



module.exports = { validateUserRegistration };