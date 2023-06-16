const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/task')
const userRouter = require('./routers/user')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('server is up on port ' + port)
})


const bcrypt = require('bcrypt');
const myFunction = async () => {
    const password = 'Red12345!';
    const hashedPassword = await bcrypt.hash(password, 8)    //number of times a hashing algorithm is executed
    console.log(hashedPassword);
    const isMatch = await bcrypt.compare('Red12345!', hashedPassword);
    console.log(isMatch);
}

myFunction();