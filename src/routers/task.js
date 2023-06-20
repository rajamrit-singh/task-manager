const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication') 

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({     //Saving the owner for each task
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)   
    }catch(err) {
        res.status(400).send(err)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks')
        /*
        Instead of using populate, we can use the below approach as well
        const tasks = await Task.find({
            owner: req.user._id
        })
        */ 
        res.send(req.user.tasks)   
    } catch(err) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res)=> {
    const _id = req.params.id
    try {
        /*Changed findbyid to find one since find by id won't let us search
        by multiple fields. This is so that we only get our own tasks*/
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if (! task) {
            return res.status(404).send('Not able to fetch the task')
        } else {
            res.send(task)
        }
    } catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
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
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        task.save();
        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }) // new = This will return new user instead of existing user that was found
        res.send(task)
    }catch(err) {
        res.status(400).send(err)
    }
})


router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({
            _id,
            owner: req.user._id
        })
        if(!task) {
            return res.status(404).send('Unable to find task')
        }
        res.send(task)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router