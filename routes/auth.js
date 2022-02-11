const express = require('express');

const {body,validationResult} = require('express-validator/check')

const route = express.Router();

route.use('/login',(req,res,next)=>{
    res.render('login',{
        path:req.originalUrl,
        title:'Login Page',

    })
})

route.use('/signup',(req,res,next)=>{
    res.render('signup',{
        path:req.originalUrl,
        title:'SignUp Page',
        
    })
})

module.exports=route