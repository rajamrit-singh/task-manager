const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')   //Get access to the token using header method and passing what we need from the header
                        .replace('Bearer ', '')     //Get the token from Authorization and remove bearer
        const decoded = jwt.verify(token, 'thisismynewcourse')  //Verifying the token by using the same secret used for generating
        const user = await User.findOne({
            _id: decoded._id,   //Look for user with this specific object id
            /*Also check if the token exists in the list of tokens for the user. We check this because decoder will just check
            if the user created the token, but it won't check if token actually still exists. In order to check the validity of token we do this
            */
            'tokens.token': token   
        })
        if (!user) {
            throw new Error()
        }
        req.token = token   //Pass the token to route handler for logout for removing the current token
        req.user = user     //Pass the user to the route handler so it doesn't have to search again
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = auth