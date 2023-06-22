const request = require('supertest')
const app = require('../app')
const Task = require('../models/task')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/user')
const {
    userOneId,
    userOne,
    setupDatabase,
    taskThree
} = require('../tests/fixtures/db')

describe('Task', () => {
    beforeEach(async () => {
        await setupDatabase()
        // Task.deleteMany({})
    })

    test('user should be able to create a task', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: 'do yoga',
            }).expect(201)
        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.completed).toBe(false)
    })

    test('user should be able to fetch his tasks', async () => {
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(200)

        expect(response.body.length).toBe(2)
    })

    test("user should not be able to delete other's tasks", async () => {
        const response = await request(app)
            .delete(`/tasks/${taskThree._id}`)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .expect(404)
        const task = Task.findById(taskThree._id)
        expect(task).not.toBeNull()
    })
})
