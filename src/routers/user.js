const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication') 
const multer = require('multer')
const sharp = require('sharp')
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
        res.status(401).send('Unable to authenticate')
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

const errorMiddleware = (req, res, next) => {
    throw new Error('From my middleware')
}

const upload = multer({
    //Commenting dest so that we can save it on user profile
    // dest: 'avatar',  //name of folder where everything will be stored
    limits: {
        fileSize: 1000000,   //Restricting file size to 1mb
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    /*Multer passes the data for the file through req.file
      This is only for the case where dest is not specified
    */
    const buffer = await sharp(req.file.buffer)
                        .resize({ width: 250, height: 250 })   //Resize to standard size
                        .png()  //Convert to png
                        .toBuffer()  //Convert to sharp buffer so that we can work on it

    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(400).send({
            error: err.message
        })
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        } else {
            res.set('Content-Type', 'image/png')   //Set response headers
            res.send(user.avatar)
        }
    } catch (error) {
        res.status(400).send()
    }
})

module.exports = router;