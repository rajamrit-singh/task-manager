const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const {
    userOneId,
    userOne,
    setupDatabase
} = require('../tests/fixtures/db')

describe('Users', () => {
    beforeEach(setupDatabase)
    
    test('should be able to signup', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'test name',
                email: 'test@gmail.com',
                password: 'test12345'
            }).expect(201)
        
        const user = await User.findById( response.body.user._id )
        expect(user).not.toBeNull() 

        //assesrtions about response
        //We can check directly for an object
        //It is okay if response has additional objects
        expect(response.body).toMatchObject({
            user: {
                name: 'test name',
                email: 'test@gmail.com',
            },
            token: user.tokens[0].token
        })
        expect(user.password).not.toBe('test12345')
    })

    test('should be able to login', async () => {
        const response = await request(app)
        .post('/users/login')
        .send({
            email: 'userone@gmail.com',
            password: 'userone123'
        }).expect(200)
        const user = await User.findById(userOneId)
        expect(response.body.token).toBe(user.tokens[1].token)
    })

    test('should not allow to login if incorrect password', async () => {
        await request(app)
        .post('/users/login')
        .send({
            email: 'userone@gmail.com',
            password: 'fakepassword'
        }).expect(401)
    })

    test('should be able to get profile', async () => {
        await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    })

    test('should be able to delete profile', async () => {
        await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        const user = await User.findOne({
            name: 'User One',
            email: 'userone@gmail.com',
        })
        expect(user).toBe(null)
    })

    test('should not get profile for unauthenticated user', async () => {
        await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
        const user = await User.findOne({
            name: 'User One',
            email: 'userone@gmail.com',
        })
        expect(user.name).toBe('User One')
    })

    test('should be able to upload avatar image', async () => {
        await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'src/tests/fixtures/profile-pic.jpg')
            .expect(200)
        const user = await User.findById(userOneId)
        expect(user.avatar).toEqual(expect.any(Buffer))     //Check if user.avatar is of the type Buffer. Also, to Equal can work with object comparision. But toBe wont'
    })

    test('should be able to update user fields', async () => {
        await request(app)
        .patch('/users/me/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Mike'
        })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.name).toBe('Mike')
    })

    test('should not be able to update invalid fields', async () => {
        await request(app)
        .patch('/users/me/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Mike'
        })
        .expect(400)
    })
})