const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
function isLoggedIn(req,res,next){
    if(!req.cookies.token) return res.redirect("/login");
    try {const data = jwt.verify(req.cookies.token,jwtSecret);
    req.user = data;
    next();}
    catch(err){
        console.error(err);
        res.clearCookie("token");
        res.redirect("/login");
    }
   
}

module.exports = {isLoggedIn};