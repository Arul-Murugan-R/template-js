const express = require('express');
const mongodb = require('mongodb')

const route = express.Router();

const Product = require('../models/product')

route.get('/home',(req,res,next) => {
    Product.find().then((result)=>{
        // console.log(result);
        res.render('home',{
            title:'Home Page',
            path:req.baseUrl,
            products:result,
        });
    })
})
route.get('/add-yours',(req,res,next) => {
    res.render('add-urs',{
        title:'Add Yours',
        path:req.baseUrl,
    });
})
route.post('/add-yours',(req,res,next) => {
    // console.log(req.body)
    const product = new Product({
        name:req.body.name,
        place:req.body.place,
        // photo:req.body.photo,
        no:req.body.no,
        mark:req.body.mark,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip,
        imgUrl:req.body.imgUrl,
        desc:req.body.desc,
        location:req.body.location,
    })
    product.save(()=>{
        res.redirect('/home')
    })
})
route.use('/view-page/:proId',(req,res,next) => {
    // console.log(req.params.proId)
    Product.findOne({_id:new mongodb.ObjectId(req.params.proId) })
    .then((result) => {
        // console.log(result)
        res.render('view-p',{
            title:'View Page',
            path:req.baseUrl,
            product:result,
        });
    })
    .catch((err)=>console.log(err))
})
route.use('/view-page',(req,res,next) => {
    res.render('view-p',{
        title:'View Page',
        path:req.baseUrl,
    });
})
module.exports=route;