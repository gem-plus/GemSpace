const userModel = require("../models/user");
const postModel = require("../models/post");


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
            let post = await postModel.findOne({_id:postid}).populate("user");
            if (!post) throw new Error("post not found");
            
            const index = post.likes.indexOf(userid);

            if(index===-1){
            post.likes.push(userid);
            }
            else{
            post.likes.splice(index,1)
            }
            await post.save();
        }catch(error){
            console.error("error in like postService:",error);
            throw error;
        }
    }

module.exports = {
    newPost,
    edit,
    update,
    like
};