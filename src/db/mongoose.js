const mongoose = require('mongoose')
//address + db name
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',
    {
        useNewUrlParser: true,
    }//When mongoose works with mongodb, this will make sure indexes are created
)



