const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const app = express()

//add new middleware for entire app
// app.use((req, res, next) => {   //same access as route handler to request and response
//     console.log(req.method)
//     console.log(req.path)
//     if (req.method === 'GET') {
//         res.send('Get requests disabled')
//     } else {
//         next();
//     }
// });

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app    //separated app and listening for testing
