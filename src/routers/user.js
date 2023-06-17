const express = require('express')
const User = require('../models/user')

const router = new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        const token = await user.generateAuthToken();   //generating token
        await user.save()
        res.status(201).send({ user, token })   //sending token and the data back
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();   //generating token for the user
        res.send({ user, token})    //providing token for the user
    } catch(error) {
    }
})
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.send(500).send()
    }
})

router.get('/users/:id', async (req, res)=> {
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

router.patch('/users/:id', async (req, res) => {
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
        const user = await User.findById(_id);
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save();
        if( !user) {
            return res.status(404).send()
        } else {
            res.send(user)
        }
    }catch(err) {
        res.status(400).send(err)
    }
})

router.delete('/users/:id', async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router;