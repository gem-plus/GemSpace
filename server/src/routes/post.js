const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middleware/auth");
const postService = require("../services/postService");


router.get("/", async (req,res)=>{
    try {
        const post = await postService.home();
        return res.json({success:true, post:post});
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }

})


router.post("/post",isLoggedIn,async (req,res)=>{
    try {
        const post = await postService.newPost({email:req.user.email,content:req.body.content});
        return res.json({ success: true, post: post });
        
    }catch(error){
        console.error("route error in /post:",error);
        return res.status(500).json({success:false});
    }    
})    


router.get("/edit/:id",isLoggedIn,async (req,res)=>{
    try {
        const post = await postService.edit({id:req.params.id});
        if(!post) return res.json({success:false});
        return res.json({success:true,post:post});
    }catch(error){
        console.error("route error in /edit:",error);
        return res.json({success:false});
    }    

})    

router.post("/update/:id",isLoggedIn,async (req,res)=>{
    try {
        await postService.update({id:req.params.id,content:req.body.content});
        return res.json({success:true});
    }catch(error){
        console.error("route error in /update:",error);
        return res.json({success:false});
    }    
})    

router.post("/like/:id",isLoggedIn,async (req,res)=>{
    try {
        const post = await postService.like({postid:req.params.id,userid:req.user.userid});
        return res.json({success: true,isliked:post.isliked ,likeCount:post.likeCount})
    }catch(error){
        console.error("route error in /like:",error);
        return res.status(500).json({success: false});
    }    

})    

router.post("/delete/:postid",isLoggedIn,async(req,res)=>{
    try {
        await postService.postDelete(req.params.postid,req.user.userid);
        return res.status(200).json({success:true})
    } catch (error) {
        return res.status(500).json({success:false,error:error})
    }
})


module.exports = router;