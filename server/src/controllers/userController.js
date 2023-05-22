// http-error hanland 
const createError = require('http-errors');


const getUesrs = (req, res, next) => {
    try {
        res.status(200).send({
            message: 'welcome to server'
        });

    } catch (error) {
        next(error);
    }
}

module.exports = getUesrs;