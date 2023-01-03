const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/attendance').then(()=>{
    console.log("Connected to MongoDb!!");
}).catch((error)=>{
    console.log(error);
})
