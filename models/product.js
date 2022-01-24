const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const proSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    place:String,
    // photo:{
    //     type:String,
    //     required:true,
    // },
    no:String,
    mark:String,
    city:String,
    state:String,
    zip:Number,
    imgUrl:String,
    desc:{
        type:String,
        required:true,
    },
    location:String,

},{timestamps:true})

module.exports=mongoose.model('Product',proSchema)