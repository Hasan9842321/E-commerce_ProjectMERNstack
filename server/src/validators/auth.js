const { body, query, check } = require("express-validator");



//registration validation
const validateUserRegistrations = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("name is required, enter your full name")
    .isLength({ min: 5, max: 31 })
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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
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

    // body('image')
    // .isString()


    // body('file').optional().isString()
    body('image')
    .custom((value, { req }) => {

        if (!req.file || !req.file.buffer) {
            throw new Error('User buffer image is required');
        }
        return true;
    })
    .withMessage('user image must  is required')






];

// Singn in validation

const validateUserLogin = [
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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
        'Password should contain at least uppercase letter, one lowercase letter, one number, and one special character.'
    ),

];

//user password update validation
const validateUserPasswordUpdate = [


    body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage("Old Password is required, enter your password")
    .isLength({ min: 6 })
    .withMessage("Old Password Should be at least 6 characters long")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
        'Password should contain at least uppercase letter, one lowercase letter, one number, and one special character.'
    ),

    body('newPassword')
    .trim()
    .notEmpty()
    .withMessage("new Password is required, enter your password")
    .isLength({ min: 6 })
    .withMessage("new Password Should be at least 6 characters long")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
        'Password should contain at least uppercase letter, one lowercase letter, one number, and one special character.'
    ),

    body("confirmedPassword").custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error("password did not match")
        }
        return true;
    })


];

const validateUserForgetPassword = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage("email is required, enter your email address")
    .isEmail()
    .withMessage("Invalid Email address"),
];


module.exports = {
    validateUserRegistrations,
    validateUserLogin,
    validateUserPasswordUpdate,
    validateUserForgetPassword,
}