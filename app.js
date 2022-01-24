const express = require('express');
const path = require('path')
const mongoose= require('mongoose')
const bodyParser = require('body-parser')

const app = express();
const URI = 'mongodb+srv://root:mypass123@cluster0.1tdiu.mongodb.net/temple'
const homeRoute = require('./routes/home')

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.set('views','views');
app.use('/images',express.static(path.join(__dirname,'images')))
app.use('/',homeRoute);
app.use((req,res,next)=>{
    res.status(404).send('<h1>Hello World</h1>');
})

mongoose.connect(URI,()=>{
    app.listen('7000',()=>{
        console.log('listening on http://localhost:7000');
    })

})