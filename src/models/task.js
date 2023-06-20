const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,   //Set the type to Object ID
        required: true,
        ref: 'User'     //Same as one provided to mongoose
    }
})

module.exports = Task