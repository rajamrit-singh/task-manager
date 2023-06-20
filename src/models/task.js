const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
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
},{
    timestamps: true
}
)
const Task = mongoose.model('Task', taskSchema)

module.exports = Task