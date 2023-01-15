const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.send(500).send()
    }
})

app.get('/users/:id', async (req, res)=> {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if( !user) {
            return res.status(404).send()
        } else {
            res.send(user)
        }
    } catch(err) {
        res.status(500).send()
    }
})

app.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidOperation  = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation) {
        return res.status(400).send('error: Invalid update')
    }
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }) // new = This will return new user instead of existing user that was found
        if( !user) {
            return res.status(404).send()
        } else {
            res.send(user)
        }
    }catch(err) {
        res.status(400).send(err)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)   
    }catch(err) {
        res.status(400).send(err)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({}) 
        res.send(tasks)   
    } catch(err) {
        res.status(500).send(error)
    }
})

app.get('/tasks/:id', async (req, res)=> {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (! task) {
            return res.status(404).send()
        } else {
            res.send(task)
        }
    } catch(error) {
        res.status(500).send(error)
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation  = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation) {
        return res.status(400).send('error: Invalid update')
    }
    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }) // new = This will return new user instead of existing user that was found
        if(!task) {
            return res.status(404).send()
        } else {
            res.send(task)
        }
    }catch(err) {
        res.status(400).send(err)
    }
})

app.listen(port, () => {
    console.log('server is up on port ' + port)
})
