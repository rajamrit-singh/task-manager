const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {   //Model created
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate: (value) => {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
        trim: true,
        validate: (value) => {
            if(value.includes('password')){
                throw new Error('Password should not contain password')
            }
        }
    }
})

module.exports = User