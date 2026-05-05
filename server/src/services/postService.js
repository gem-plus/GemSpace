const userModel = require("../models/user");
const postModel = require("../models/post");

    async function home() {
        const posts = await postModel.find().populate("user");
        return posts
    }

    async function newPost({email,content}){
        try{
            let user = await userModel.findOne({email});
            if(!user) throw new Error("User not found");
            
            let post = await postModel.create({
                user: user._id,
                content
            });
            
            user.posts.push(post._id);
            await user.save();
            return post;
        }catch(error){
            console.error("error in newpost service:",error);
            throw error;
    }
    }

    async function edit({id}){
        try{
            let post = await postModel.findOne({_id:id});
            return post;
        }catch(error){
            console.error("error in edit postService:",error);
            return null;
        }
  
    }

    async function update({id,content}){
        try{
            await postModel.findOneAndUpdate({_id:id},{content:content});
        }catch(error){
            console.error("error in update postService:",error);
            throw error;
        }
    }

    async function like({postid,userid}){
        try {
            let post = await postModel.findOne({_id:postid});
            if (!post) throw new Error("post not found");

            let isliked = post.likes.includes(userid);

            if (isliked){
                post.likes.pull(userid);
            }else{
                post.likes.push(userid);
            }

            await post.save();

            return {isliked:!isliked,likeCount:post.likes.length};
        }catch(error){
            console.error("error in like postService:",error);
            throw error;
        }
    }

module.exports = {
    home,
    newPost,
    edit,
    update,
    like
};