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


// const jwt = require('jsonwebtoken');
// const myFunction = async () => {
//     const token = jwt.sign({ _id: '1234'}, 'thiddfsdsf')
//     const data = jwt.verify(token, 'asdasd')
//     console.log(token);
// }

// myFunction();