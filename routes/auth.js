const express = require('express');

const {body,validationResult} = require('express-validator/check')

const route = express.Router();

route.use('/login',(req,res,next)=>{
    res.send('Welcome to Login Page')
})

route.use('/signup',(req,res,next)=>{
    res.send('Welcome to Sign-Up Page')
})