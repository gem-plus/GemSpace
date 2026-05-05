const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
function isLoggedIn(req,res,next){
    if(!req.cookies.token) return res.status(401).json({ success: false, message: "Unauthorized" });
    try {const data = jwt.verify(req.cookies.token,jwtSecret);
    req.user = data;
    next();}
    catch(err){
        console.error(err);
        res.clearCookie("token");
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
   
}

module.exports = {isLoggedIn};