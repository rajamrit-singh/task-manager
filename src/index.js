const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const app = express()
const port = process.env.PORT || 3000

//add new middleware
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

app.listen(port, () => {
    console.log('server is up on port ' + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('64911d2df5aaa1b9d2824a6e')
    // await task.populate('owner')     //FInd the user associated with this task and then task.owner will be their entire profile
    // console.log(task.owner)

    // const user = await User.findById('64911c6565e058ef17b0c96f')
    // await user.populate('tasks')
}

main()

// const jwt = require('jsonwebtoken');
// const myFunction = async () => {
//     const token = jwt.sign({ _id: '1234'}, 'thiddfsdsf')
//     const data = jwt.verify(token, 'asdasd')
//     console.log(token);
// }

// myFunction();