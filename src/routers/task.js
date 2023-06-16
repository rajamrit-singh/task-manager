const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)   
    }catch(err) {
        res.status(400).send(err)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({}) 
        res.send(tasks)   
    } catch(err) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res)=> {
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

router.patch('/tasks/:id', async (req, res) => {
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
        const task = await Task.findById(_id);
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        task.save();
        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }) // new = This will return new user instead of existing user that was found
        if(!task) {
            return res.status(404).send()
        } else {
            res.send(task)
        }
    }catch(err) {
        res.status(400).send(err)
    }
})


router.delete('/tasks/:id', async(req, res) => {
    try {
        const tasks = await Task.findByIdAndDelete(req.params.id)
        if(!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router