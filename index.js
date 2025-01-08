const express = require('express');
const path = require("path");
require('dotenv').config();
const { connectToMongoDb } = require("./connect");
const PORT = process.env.PORT;
const  MONGO_URL  = process.env.MONGO_URL;

const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const { checkForCookies } = require('./middlewares/auth_middleware');

const app = express();

connectToMongoDb(MONGO_URL).then(()=>{
    console.log("Database Connected");
});

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());  // to parse json data
app.use(express.urlencoded({extended:false}));  // to parse form data
app.use(cookieParser()); // to parse cookeis

app.use(checkForCookies("token"));

app.get("/",(req,res)=>{
    return res.render("home",{user : req.user});
});

app.use("/user",userRouter);


app.listen(8002,()=>{
    console.log("Server started at port "+PORT);
})