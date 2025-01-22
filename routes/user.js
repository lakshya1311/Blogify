const {Router} = require("express");
const {User} = require("../models/user");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const userRouter = Router();

// Configure storage engine and filename
const storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        console.log(req.user);
        let pathOfFile = await path.resolve(`./public/assets/`);
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
  }).single('profileImageURL'); // 'profileImageURL' is the name attribute of the file input field
  


//load sign-in page
userRouter.get("/signin",(req,res)=>{
    return res.render("signin");
});

//load sign-up page
userRouter.get("/signup",(req,res)=>{
    return res.render("signup");
});

userRouter.post("/signin", async (req,res)=>{
    const{email, password}=req.body;
    try {
        const token = await User.matchPasswordAndCreateToken(email,password);
        return res.cookie("token",token).redirect("/");
    } catch (error) {
        return res.render("signin",{error:"Incorrect email or password"});
    }
});

//create user in DB and open sign-in page
userRouter.post("/signup",upload, async (req,res)=>{
    const {fullName , email, password} = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
            profileImageURL : `/assets/${req.file.filename}`
        });  
    } catch (error) {
        const ce=error;
        if(ce.errorResponse.code=11000)
        {
            return res.render("signup",{error:"Email Id already exists"});
        }
        return res.render("signup",{error:ce.errorResponse.errmsg});
    }

    return res.render("signin");


});

//logout user
userRouter.get("/logout", (req,res)=>{
    return res.clearCookie("token").redirect("/");
})

module.exports = userRouter;

