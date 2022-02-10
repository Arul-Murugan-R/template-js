const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    product:{
        type:Schema.Type.Object,
        ref:'product',
    },
    access:{
        default:'User'
    }
},{timestamp:true})

module.exports=mongoose.model('user',userSchema)