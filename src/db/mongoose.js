const mongoose = require('mongoose')
//address + db name
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
    }//When mongoose works with mongodb, this will make sure indexes are created
)



