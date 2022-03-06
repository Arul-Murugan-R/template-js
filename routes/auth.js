const express = require('express');

const {body,validationResult} = require('express-validator/check')
const bcrypt = require('bcrypt')
const route = express.Router();
const User = require('../models/user')

route.post('/login',
[
    body('email').not().isEmpty().withMessage('Requires Email').isEmail().withMessage('Invalid Email'),
    body('password').not().isEmpty().withMessage('Requires Password'),
],
 (req, res, next) => {
    const errors = validationResult(req)
    // console.log(errors.array())
    if(!errors.isEmpty()){
        return res.render('signup',{
            path:req.originalUrl,
            title:'SignUp Page',
            message:errors.array()[0].msg,
            values:req.body
        })
    }
    User.findOne({email:req.body.email})
    .then((user)=>{
        if(!user){
            return res.render('login',{
                path:req.originalUrl,
                title:'Login Page',
                message:'User Not Found',
                values:req.body
            }) 
        }
        bcrypt.compare(req.body.password,user.password)
        .then((check)=>{
            if(!check){
                return res.render('login',{
                    path:req.originalUrl,
                    title:'Login Page',
                    message:'Incorrect Password',
                    values:req.body
                })
            }
            req.session.isLoggedIn=true;
            req.session.user=user
            return
        })
        .catch((err)=>{
            console.log(err)
        })
        .then(()=>{
            res.redirect('/home')
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    .catch((err)=>{
        console.log(err)
    })
})

route.get('/login',(req,res,next)=>{
    res.render('login',{
        path:req.originalUrl,
        title:'Login Page',
        values:{}

    })
})

route.post('/signup',
[
    body('name').not().isEmpty().withMessage('Requires Name').isLength({min:4}).withMessage('Check For the size of name'),
    body('email').not().isEmpty().withMessage('Requires Email').custom((val,{req})=>{
        return User.findOne({email:val})
        .then((stat)=>{
            console.log(val)
            console.log(stat)
            if(stat){
                return Promise.reject('User Already Exists')
            }
        })
    }),
    body('password').not().isEmpty().withMessage('Requires Password').isLength({min:5}).withMessage('Weak Password Less Size'),
    body('cpassword').not().isEmpty().withMessage('Requires Confirm Password')
],
(req,res,next)=>{
    // console.log(req.body)
    const errors = validationResult(req)
    // console.log(errors.array())
    if(!errors.isEmpty()){
        return res.render('signup',{
            path:req.originalUrl,
            title:'SignUp Page',
            message:errors.array()[0].msg,
            values:req.body
        })
    }
    if(req.body.password!==req.body.cpassword){
        return res.render('signup',{
            path:req.originalUrl,
            title:'SignUp Page',
            message:'Password Not Matching',
            values:req.body
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
    .catch((err)=>{
        console.log(err)
    })

})

route.get('/signup',(req,res,next)=>{
    res.render('signup',{
        path:req.originalUrl,
        title:'SignUp Page',
        message:null,
        values:{}
    })
})
route.use('/logout',(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/home')
    })
})

module.exports=route