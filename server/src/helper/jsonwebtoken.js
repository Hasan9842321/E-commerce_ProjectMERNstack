const jwt = require('jsonwebtoken');

const createJsonWebToken = (payload, secretKey, expireIn) => {



    if (typeof payload !== 'object' || !payload) {
        throw new Error('Payload must be non-empty object');

    }

    if (typeof secretKey !== 'string' || secretKey === '') {
        throw new Error('secretkey must be non-empty string');

    }

    try {

        const token = jwt.sign(payload, secretKey, { expireIn });
        return token;
    } catch (error) {
        console.log('Faild to Signin the JWT', error);

    }

}

module.exports = { createJsonWebToken };