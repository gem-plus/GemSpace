const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middleware/auth");
const postService = require("../services/postService");


router.post("/post",isLoggedIn,async (req,res)=>{
    try {
        await postService.newPost({email:req.user.email,content:req.body.content});
        return res.redirect("/profile");
    }catch(error){
        console.error("route error in /post:",error);
        return res.status(500).send("Internal Server Error");
    }
})


router.get("/edit/:id",isLoggedIn,async (req,res)=>{
    try {
        const post = await postService.edit({id:req.params.id});
        if(!post) return res.redirect("/profile");
        return res.render("edit",{post});
    }catch(error){
        console.error("route error in /edit:",error);
        return res.redirect("/profile");
    }

})

router.post("/update/:id",isLoggedIn,async (req,res)=>{
    try {
        await postService.update({id:req.params.id,content:req.body.content});
        return res.redirect("/profile");
    }catch(error){
        console.error("route error in /update:",error);
        return res.redirect("/profile");
    }

})

router.post("/like/:id",isLoggedIn,async (req,res)=>{
    try {
        await postService.like({postid:req.params.id,userid:req.user.userid});
        return res.redirect("/profile");
    }catch(error){
        console.error("route error in /like:",error);
        return res.redirect("/profile");
    }

})


module.exports = router;