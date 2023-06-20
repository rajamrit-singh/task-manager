const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication') 

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
        res.send('Unable to authenticate')
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token     // Return true if the token isn't the current token. This is done to make sure we don't logout of multiple devices
        })
        await req.user.save()
        res.status(200).send('Logout successful')
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []    //logout the user from all the account therefore deleting all the tokens
        await req.user.save()
        res.status(200).send('Logout successful')
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

/*
We shouldn't allow user to get any user's details via id
*/
// router.get('/users/:id', async (req, res)=> {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if( !user) {
//             return res.status(404).send()
//         } else {
//             res.send(user)
//         }
//     } catch(err) {
//         res.status(500).send()
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const user = req.user
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidOperation  = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation) {
        return res.status(400).send('error: Invalid update')
    }
    try {
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save();
        res.send(user)
    }catch(err) {
        res.status(400).send(err)
    }
})

router.delete('/users/me', auth, async(req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router;