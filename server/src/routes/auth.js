const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const authService = require("../services/authService");

router.get("/",(req,res)=>{
    if (req.cookies.token) return res.redirect("/profile");
    return res.render("index");
});

router.post("/register",async (req,res)=>{
    try{
        let {username ,name , age , email , password} = req.body;
        const token = await authService.register({username ,name , age , email , password});
        if (token){
            res.cookie("token",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                maxAge: 3600000
            });
            return res.redirect("/profile")
        }
        return res.redirect("/");
    }catch(error){
        console.error("route error in /register:",error);
        return res.redirect("/");
    }
});

router.post("/login",async (req,res)=>{
    try{
        const token = await authService.login({email:req.body.email,password:req.body.password});
        if (token){
            res.cookie("token",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                maxAge:3600000
            });
            return res.redirect("/profile")
        }
        return res.redirect("/login");
    }catch(error){
        console.error("route error in /login:",error);
        return res.redirect("/login");
    }

});

router.get("/login",(req,res)=>{
    if (req.cookies.token) return res.redirect("/profile");
    return res.render("login");
});

router.get("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production"
    });
    return res.redirect("/login");
});

router.get("/profile",isLoggedIn,async (req,res)=>{
    try{
        const user = await authService.populateProfile(req.user.email);
        if(!user) return res.redirect("/login");
        return res.render("profile",{user});
    }catch(error){
        console.error("route error in /profile:",error);
        return res.redirect("/login");
    }

})

module.exports = router;