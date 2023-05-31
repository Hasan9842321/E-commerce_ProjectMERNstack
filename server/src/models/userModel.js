const { Schema, model, default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const defaultImagePath = require('../secret');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "user name is required"],
        trim: true,
        minlength: [5, "the length user name can be 31 characters"],
        maxlength: [31, "the length of user name can be maximum 31 characters"]
    },
    email: {
        type: String,
        required: [true, "user email is required"],
        trim: true,
        unique: true,
        validate: {
            validator: (v) => {
                return /^\w+([\•− ]?\w+)*@\w+( [\•− ]?\w+)*(\.\w{2,3})+$/.test(v);

            },
            message: 'Please enter a valid email'

        }
    },
    password: {
        type: String,
        required: [true, "user password is required"],
        minlength: [6, "the length user password can be 6 characters"],
        set: (v) => {
            return bcrypt.hashSync(v, bcrypt.genSaltSync(10));

        }

    },
    image: {
        type: mongoose.Schema.Types.Mixed,
        // type: String,
        default: defaultImagePath

    },
    address: {
        type: String,
        required: [true, "user address required"]
    },
    phone: {
        type: String,
        required: [true, "user phone required"]

    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const User = model('Users', userSchema);

module.exports = User;