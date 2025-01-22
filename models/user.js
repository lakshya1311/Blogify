const {Schema , model} = require('mongoose');
const {createHmac, randomBytes} = require("crypto");
const {createToken,verifyToken}= require("../services/authentication_service")
const path = require("path");

const userSchema = new Schema({
  fullName:{
    type:String,
    required:true,
  } ,
  salt:{
    type:String,
  },
  email:{
      type:String,
      required : true,
      unique:true,
    },
  password:{
    type:String,
    required:true,
  },
  profileImageURL:{
    type:String,
    default: "/assets/hacker.png"
  },
  role:{
    type:String,
    enum:["USER","ADMIN"],
    default:"USER"
  }
},{timestamps:true});

userSchema.pre("save", async function(next){
    const user = this;

    if(!user.isModified("password"))
        return;

    const password = user.password;

    const salt= randomBytes(16).toString();
    const hashedPassword = await createHmac("sha256",salt)
    .update(password)
    .digest("hex");

    this.salt=salt;
    this.password=hashedPassword;

    next();
});

userSchema.static("matchPasswordAndCreateToken", async function(email,userEnteredPassword){
  const user = await this.findOne({email});

  if(!user)
    return false;

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash =  await createHmac("sha256",salt)
  .update(userEnteredPassword)
  .digest("hex");

  if(hashedPassword !== userProvidedHash)
    throw new Error("Incorrect Password");

  const token = createToken(user);

  return token;
  
})

const User= model("User",userSchema);
module.exports={ User };