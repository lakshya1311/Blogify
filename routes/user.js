const {Router} = require("express");
const {User} = require("../models/user");

const userRouter = Router();

userRouter.get("/signin",(req,res)=>{
    return res.render("signin");
});

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

userRouter.post("/signup", async (req,res)=>{
    const {fullName , email, password} = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
        });  
    } catch (error) {
        const ce=error;
        if(ce.errorResponse.code=11000)
        {
            return res.render("signup",{error:"Email Id already exists"});
        }
        return res.render("signup",{error:ce.errorResponse.errmsg});
    }

    return res.render("signin",{error:error});


});

userRouter.get("/logout", (req,res)=>{
    return res.clearCookie("token").redirect("/");
})

module.exports = userRouter;

