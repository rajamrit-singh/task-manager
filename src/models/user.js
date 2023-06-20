const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Task = require('./task')
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
        trim: true,
        lowercase: true,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',     //Where local data is stored
    foreignField: 'owner'   //Name of the field on the other thing that will create the relationship
})
// generate a method on a specific user (adding methods on instances of object/model)
userSchema.methods.generateAuthToken = async function () {
    const user = this   //this refers to the current user
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse', { expiresIn: '2 weeks'})
    user.tokens.push({ token });
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    /*
    It converts the user instance to a plain JavaScript object using user.toObject().
    This step is necessary because Mongoose documents have various internal properties
    and methods that are not needed when returning a user object.
    */
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}

//hash password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)    //number of times a hashing algorithm is executed
    }
    next()  //Call when done so that node will know that we are done with the middleware
});

//Delete user task when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({
        owner: user._id
    })
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User