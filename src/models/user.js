const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');

/*const User = mongoose.model('User', {   //2nd argument is an object and mongoose converts this object into a scheme behind the scenes. In order to take advantage of middlewares, we need to directly pass the schema as show below
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
*/
const userSchema = new mongoose.Schema({
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
            if (value < 0) {
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
            if (value.includes('password')) {
                throw new Error('Password should not contain password')
            }
        }
    }
})
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)    //number of times a hashing algorithm is executed
    }
    console.log('here inside pre');
    next()  //Call when done so that node will know that we are done with the middleware
});
const User = mongoose.model('User', userSchema)
module.exports = User