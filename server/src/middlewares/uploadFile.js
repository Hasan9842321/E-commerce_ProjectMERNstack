const multer = require('multer');
// const path = require('path');
// const createError = require('http-errors');
const { UPLOAD_USER_IMG_DIRECTORY, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require('../config');




// const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 2097152;
// const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES || ['jpg', 'jpeg', 'png'];
// const UPLOAD_USER_IMG_DIRECTOR = process.env.UPLOAD_USER_IMG_DIRECTOR || 'public/images/users';

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, UPLOAD_USER_IMG_DIRECTOR)
//     },
//     filename: (req, file, cb) => {

//         const extname = path.extname(file.originalname);
//         cb(null, Date.now() + '-' + file.originalname.replace(extname, '') + extname);
//         // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         // cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })

const fileFilter = async(req, file, cb) => {
    // const extname = path.extname(file.originalname);

    // if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {

    //     return cb(new Error('file Type not allowed'), false);
    // }
    // cb(null, true)

    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image are allowd'), false);
    } else if (file.size > MAX_FILE_SIZE) {
        return cb(new Error('File size exceds the maximum limit '), false)
    } else if (!(ALLOWED_FILE_TYPES.includes(file.mimetype))) {
        return cb(new Error('File extension is not allowd'), false)
    } else {

        return cb(null, true)
    }



}


const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE }, // limits: { fileSize: MAX_FILE_SIZE }, 
    // fileFilter: fileFilter
    fileFilter
});

module.exports = { upload };