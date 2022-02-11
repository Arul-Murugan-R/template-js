const express = require('express');

const {body,validationResult} = require('express-validator/check')

const route = express.Router();
const User = require('../models/user')

route.use('/login',(req,res,next)=>{
    res.render('login',{
        path:req.originalUrl,
        title:'Login Page',

    })
})

route.post('/signup',
[
    body('name').not().isEmpty().isLength({max:4}).withMessage('Check For the size of name'),
    body('email').not().isEmail().custom((val,{req})=>{
        User.find({email:val})
        .then((stat)=>{
            if(stat){
                return Promise.reject('Email Id already taken')
            }
        })
    }),
    body('password').not().isEmpty().isLength({max:7}).withMessage('Weak Password Less Size'),
],
(req,res,next)=>{
    console.log(req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('signup',{
            path:req.originalUrl,
            title:'SignUp Page',
            message:errors.array()[1],
        })
    }
})

route.get('/signup',(req,res,next)=>{
    res.render('signup',{
        path:req.originalUrl,
        title:'SignUp Page',
        message:null
    })
})

module.exports=route