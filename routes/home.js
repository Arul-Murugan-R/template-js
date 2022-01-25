const express = require('express');
const mongodb = require('mongodb')

const route = express.Router();

const Product = require('../models/product')
// let LIMIT =0;


route.get('/home',(req,res,next) => {
    Product.find()
    .then((result)=>{
        // console.log(result);
        res.render('home',{
            title:'Home Page',
            path:req.originalUrl,
            products:result,
        });
    })
})
route.get('/add-yours',(req,res,next) => {
    // console.log(req)
    res.render('add-urs',{
        title:'Add Yours',
        path:req.originalUrl,
        edit:false,
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
            path:req.originalUrl,
            product:result,
        });
    })
    .catch((err)=>console.log(err))
})
route.use('/view-page',(req,res,next) => {
    res.render('view-p',{
        title:'View Page',
        path:req.originalUrl,
    });
})
route.post('/edit',(req,res,next)=>{
    let _id=req.body._id;
    // console.log(req.body)
    Product.findOne({_id:new mongodb.ObjectId(_id)})
    .then((pro)=>{
        pro.name=req.body.name;
        pro.place=req.body.place;
        pro.no=req.body.no;
        pro.mark=req.body.mark;
        pro.city=req.body.city;
        pro.state=req.body.state;
        pro.zip=req.body.zip;
        pro.imgUrl=req.body.imgUrl;
        pro.desc=req.body.desc;
        pro.location=req.body.location;
        pro.save(()=>{
            res.redirect('/home')
        })
    })
})
route.use('/edit/:proId',(req,res,next) => {
    let _id = req.params.proId;
    // console.log(_id)
    Product.findOne({_id:new mongodb.ObjectId(_id)})
    .then((product) => {
        res.render('add-urs',{
            title:'Edit Product',
            path:req.originalUrl,
            edit:true,
            product:product,
        })
    })
})
module.exports=route;