const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../models/user')
const Task = require('../../models/task')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId  = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'User One',
    email: 'userone@gmail.com',
    password: 'userone123',
    tokens: [{
        token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    _id: userTwoId,
    name: 'User two',
    email: 'usertwo@gmail.com',
    password: 'usertwo123',
    tokens: [{
        token: jwt.sign({ _id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task one',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task two',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'task Three',
    completed: true,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await Task.deleteMany()
    await User.deleteMany()    //Delete all users before running the test
    await User(userOne).save()
    await User(userTwo).save()
    await Task(taskOne).save()
    await Task(taskTwo).save()
    await Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
}