const express = require('express');
const path = require('path')
const mongoose= require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer');
require('dotenv').config()

const app = express();
const URI = `mongodb+srv://${process.env.NAME}:${process.env.DPASS}@cluster0.1tdiu.mongodb.net/${process.env.dbname}`
const homeRoute = require('./routes/home')
const authRoute = require('./routes/auth')

const Storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    }, 
    filename:(req,file,cb)=>{
        cb(null,parseInt(Math.random()*10000)+'-'+file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mime==='image/png' || file.mime==='image/jpeg' || file.mime==='image/gif' || file.mime==='image/jpg'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({storage:Storage}).single('photo'))
app.set('view engine', 'ejs');
app.set('views','views');
app.use('/images',express.static(path.join(__dirname,'images')))
app.use('/auth',authRoute);
app.use('/',homeRoute);
app.use((req,res,next)=>{
    res.status(404).send('<h1>Hello World</h1>');
})

mongoose.connect(URI,()=>{
    app.listen('7000',()=>{
        console.log('listening on http://localhost:7000');
    })

})