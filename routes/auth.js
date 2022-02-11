const express = require('express');

const {body,validationResult} = require('express-validator/check')
const bcrypt = require('bcrypt')
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
    body('name').not().isEmpty().isLength({min:4}).withMessage('Check For the size of name'),
    body('email').not().isEmpty().custom((val,{req})=>{
        return User.findOne({email:val})
        .then((stat)=>{
            console.log(val)
            console.log(stat)
            if(stat){
                return res.redirect('/auth/signup')
            }
        })
    }),
    body('password').not().isEmpty().isLength({min:5}).withMessage('Weak Password Less Size'),
],
(req,res,next)=>{
    console.log(req.body)
    const errors = validationResult(req)
    console.log(errors.array())
    if(!errors.isEmpty()){
        return res.render('signup',{
            path:req.originalUrl,
            title:'SignUp Page',
            message:errors.array()[0].msg,
        })
    }
    if(req.body.password!==req.body.cpassword){
        return res.render('signup',{
            path:req.originalUrl,
            title:'SignUp Page',
            message:'Password Not Matching',
        })
    }
    bcrypt.hash(req.body.password,12)
    .then((hashed)=>{
        if(hashed){
            const user = new User({
                name:req.body.name,
                email:req.body.email,
                password:hashed,
            })
            user.save(()=>{
                res.redirect('/auth/login')
            })
        }
    })

})

route.get('/signup',(req,res,next)=>{
    res.render('signup',{
        path:req.originalUrl,
        title:'SignUp Page',
        message:null
    })
})

module.exports=route