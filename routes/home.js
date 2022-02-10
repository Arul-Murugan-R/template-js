const express = require('express');
const mongodb = require('mongodb')
const {body,validationResult} = require('express-validator/check')
const fs = require('fs')
const path = require('path')

const route = express.Router();
let totalSearch=0,productCount=0
const Product = require('../models/product')
    Product.find()
    .then((product)=>{
        for(let pro of product){
            totalSearch+=pro.search
            productCount+=1
        }
    })


route.get('/home',(req,res,next) => {
    Product.find()
    .then((result)=>{
        // console.log((totalSearch/(productCount/2)));
        const recom=result.filter(p=>{return p['search']>=(totalSearch/(productCount/2))})
        // console.log(recom)
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
        message:null,
        errors:[],
        input:'',
    });
})
route.use('/search',(req,res,next)=>{
    const search = req.query.search;
    const filter = req.query.filter || 'location'
    // console.log(search)
    Product.find()
    .then((products)=>{
        // console.log(products[0][filter])
        let some=products.filter(p=>{
            if(p[filter].toLowerCase().includes(search.toLowerCase())){
                // console.log('search of '+p['name']+' = '+p['search'])
                p['search']+=1
                p.save()
            }
            return p[filter].toLowerCase().includes(search.toLowerCase())})
        return some
    })
    .then(pro=>{
        // console.log(pro)
        if(pro===[]){
            return res.redirect('/home')
        }
        res.render('home',{
            title:'Search Product',
            path:req.originalUrl,
            products:pro,
        });
    })
})
route.use('/product',(req,res,next)=>{
    res.render('list',{
        title:'My List',
        path:req.originalUrl,

    })
})
route.post('/add-yours',
[
    body('name').not().isEmpty().isLength({max:25}).withMessage('Check For the size of name'),
    body('location').not().isEmpty().isLength({max:20}).withMessage('Check the size'),
    body('desc').not().isEmpty().withMessage('Fill with Description'),
],
(req,res,next) => {
    // console.log(req.body)
    let photo
    const errors = validationResult(req) 
    // console.log(errors.array())
    // console.log(errors.array()[0].msg)
    if(!errors.isEmpty()){
        return res.render('add-urs',{
            title:'Add Yours',
            path:req.originalUrl,
            edit:false,
            errors:errors.array(), 
            message:errors.array()[0].msg,
            input:req.body
        });
    }
    // console.log(req.file)
    if(!req.file){
        return res.status(422).render('add-urs',{
            title:'Add Yours',
            path:req.originalUrl,
            edit:false,
            errors:[{params:'photo',},], 
            message:'Image is not set',
            input:req.body
        });
    }
    photo=req.file.path.replace('\\','/');
    // console.log(photo)
    const product = new Product({
        name:req.body.name,
        place:req.body.place,
        photo:photo,
        no:req.body.no,
        mark:req.body.mark,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip,
        email:req.body.email,
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
        product:[]
    });
})
route.post('/edit',
[
    body('name').not().isEmpty().isLength({max:25}).withMessage('Check For the size of name'),
    body('location').not().isEmpty().isLength({max:20}).withMessage('Check the size'),
    body('desc').not().isEmpty().withMessage('Fill with Description'),
],
(req,res,next)=>{
    const errors = validationResult(req) 
    let photo
    if(!errors.isEmpty()){
        return res.render('add-urs',{
            title:'Edit Yours',
            path:req.originalUrl,
            edit:true,
            errors:errors.array(), 
            message:errors.array()[0].msg,
            product:req.body,
            input:''
        });
    }
    let _id=req.body._id;
    // console.log(req.body)
    if(req.file){
        photo=req.file.path
        Product.findOne({_id:new mongodb.ObjectId(_id)})
        .then((result)=>{
            unLink(result.photo)
        })
    }
    Product.findOne({_id:new mongodb.ObjectId(_id)})
    .then((pro)=>{
        pro.name=req.body.name;
        pro.place=req.body.place;
        if(photo){
            pro.photo=photo;
        }
        pro.no=req.body.no;
        pro.mark=req.body.mark;
        pro.city=req.body.city;
        pro.state=req.body.state;
        pro.zip=req.body.zip;
        pro.email=req.body.email;
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
            message:null,
            errors:[],
            input:[]
        })
    })
})

route.use('/delete/:proId',(req,res,next)=>{
    Product.findByIdAndRemove(req.params.proId)
    .then((result)=>{
        unLink(result.photo)
        // console.log(result)
        res.redirect('/home')
    })
})

const unLink=(imgPath)=>{
    // console.log(path.join(__dirname,'..',imgPath))
    fs.unlink(path.join(__dirname,'..',imgPath),(err)=>{
        console.log(err)
    })
}

module.exports=route;