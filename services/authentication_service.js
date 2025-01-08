const JWT = require("jsonwebtoken");
require('dotenv').config();
const secret = process.env.SECRET

function createToken(user){
    const payload = {
        id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImage:user.profileImageURL
    }

    const token = JWT.sign(payload,secret);

    return token;
};

function verifyToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}

module.exports={createToken,verifyToken};