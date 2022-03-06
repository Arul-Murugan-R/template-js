const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const proSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    place:String,
    photo:{
        type:String,
        required:true,
    },
    no:String,
    mark:String,
    city:String,
    state:String,
    zip:Number,
    email:String,
    desc:{
        type:String,
        required:true,
    },
    location:String,
    search:{
        type:Number,
        default:0,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }

},{timestamps:true})

module.exports=mongoose.model('Product',proSchema)