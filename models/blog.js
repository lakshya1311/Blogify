const {Schema , model, default: mongoose, Mongoose} = require('mongoose');

const blogSchema = new Schema({
    Body:{
        type:String,
        required:true
    },
    Title:{
        type:String,
        required:true
    },
    CoverImageUrl:{
        type:String,
    },
    Author:{
        type : Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

const Blog = model("blog",blogSchema);
module.exports={
    Blog
};