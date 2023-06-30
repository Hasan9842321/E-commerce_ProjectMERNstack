const multer = require('multer');
const path = require('path');


// const UPLOAD_DIR=process.env.UPLOAD_IMAGES ||'public/images/users';
const UPLOAD_DIR = process.env.UPLOAD_IMAGES || 'public/images/users';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => {

        const extname = path.extname(file.originalname);
        cb(null, Date.now() + '-' + file.originalname.replace(extname, '') + extname);
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({ storage: storage });

module.exports = { upload };