const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const authService = require("../services/authService");
const postService = require("../services/postService");



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
            return res.status(201).json({ success: true });
        }
    }catch(error){
       if (error.message==="duplicate"){
        return res.status(409).json({ success: false, message: "User already exists" });
       }
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

router.post("/login",async (req,res)=>{
    try{
        const token = await authService.login({email:req.body.email,password:req.body.password});
        if (token){
            res.cookie("token",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                maxAge:3600000,
                sameSite: "lax"
            });
            return res.json({success:true})
        }
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }catch(error){
        console.error("route error in /login:",error);
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

});


router.get("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production"
    });
    return res.json({ success: true });
});

router.get("/profile",isLoggedIn,async (req,res)=>{
    try{
        const user = await authService.populateProfile(req.user.email);
        if(!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
        return res.json({success:true,name:user.name, username:user.username ,posts: user.posts, userID:req.user.userid})
    }catch(error){
        console.error("route error in /profile:",error);
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
})

module.exports = router;