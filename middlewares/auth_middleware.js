const {verifyToken} = require("../services/authentication_service")
function checkForCookies(cookieName){
    return (req,res,next)=>{
        try {
            const token = req.cookies[cookieName];
            if(!token)
                return next();

            const payload = verifyToken(token);
            req.user = payload;
        } catch (error) { }

        return next();
    }
}

module.exports={checkForCookies}