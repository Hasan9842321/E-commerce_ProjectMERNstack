const errorResponse = (res, { statusCode = 500, message = "Internal Server error" }) => {

    res.status(statusCode).json({

        success: false,
        message: message
    });
};

const successResponse = (res, { statusCode = 200, message = "server found successfullyr", paylod = {} }) => {

    res.status(statusCode).json({

        success: true,
        message: message,
        paylod
    });
};

module.exports = { errorResponse, successResponse };