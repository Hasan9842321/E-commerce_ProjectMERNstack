const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
// http-error hanland 
const createError = require('http-errors');
//API security 
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/userRouter');
const { seedRouter } = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseController');
const { authRouter } = require('./routers/authRouter');

const rateLimitr = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP. Please try again later'
})

app.use(cookieParser)
app.use(rateLimitr)
app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use('/api/auth', authRouter)
app.use("/api/seed", seedRouter);




app.get("/test", (req, res) => {
    res.status(200).send({
        message: 'GET: api testing done'
    });
})

app.post("/test", (req, res) => {
    res.status(200).send({
        message: 'post: api testing done'
    });
})

app.put("/test", (req, res) => {
    res.status(200).send({
        message: 'put: api testing done'
    });
})

app.delete("/test", (req, res) => {
    res.status(200).send({
        message: 'delete: api testing done'
    });
})

//client error handling 
app.use((req, res, next) => {

    next(createError(404, 'route not found'));
})

//server error handling 
app.use((err, req, res, next) => {
    // return res.status(err.status || 500).json({
    //     success: false,
    //     message: err.message
    // });

    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    });
})


module.exports = app;