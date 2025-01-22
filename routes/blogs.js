const {Router}= require("express");
const {Blog}=require("../models/blog");
const {Comment} = require("../models/comments");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = Router();

// Configure storage engine and filename
const storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        let pathOfFile = await path.resolve(`./public/uploads/${req.user.id}`);
        if (!fs.existsSync(pathOfFile)) {
            fs.mkdirSync(pathOfFile);
        }
        cb(null,pathOfFile);
      } ,
    filename: function(req, file, cb) {
        
        const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName);
    }
  });
  
  // Initialize upload middleware and add file size limit
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10MB file size limit
  }).single('CoverImageUrl'); // 'CoverImageUrl' is the name attribute of the file input field
  
  // File upload route
  router.post('/Blog', upload, async (req, res) => {
    const {Title, Body} = req.body;
    
   const blog = await Blog.create({
        Body,
        Title,
        Author: req.user.id,
        CoverImageUrl : `/uploads/${req.user.id}/${req.file.filename}`
    });
    return res.redirect(`/addBlog/Blog/${blog._id}`);
  });

router.get("/Blog/:id",async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("Author");
    const comments = await Comment.find({blogId:req.params.id}).populate("createdBy").populate("blogId");
    return res.render("Blog",{user: req.user , blog:blog , comments:comments});
});

router.post("/comment/:blogId", async (req,res)=>{
  const comment = await Comment.create({
    content : req.body.content , 
    createdBy: req.user.id,
    blogId: req.params.blogId
  });

  return res.redirect(`/addBlog/Blog/${req.params.blogId}`);

})

router.get("/",(req,res)=>{
    return res.render("addBlogs",{
        user:req.user,
    });
});

module.exports=router;


// DisableDevtool({
//   ondevtoolopen: (type) => {
      
//       window.location.href = "about:blank";
     
//   },
// });