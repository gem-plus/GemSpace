const userModel = require("../models/user");
const postModel = require("../models/post");
const cloudinary = require("../config/cloudinary");

async function home(page = 1, limit = 6) {
  const skip = (page - 1) * limit;
  const posts = await postModel
    .find()
    .populate("user", "username profilePic _id")
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const postsWithAvatar = posts.map((post) => ({
    ...post.toObject(),
    avatarURL: cloudinary.url(post.user.profilePic, {
      width: 30,
      height: 30,
      crop: "fill",
      gravity: "face",
    }),
  }));

  return { posts: postsWithAvatar };
}

async function newPost({ email, content }) {
  try {
    let user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const contentlen = content.length;
    if (contentlen > 90) throw new Error("context window crossed");

    let post = await postModel.create({
      user: user._id,
      content,
    });

    user.posts.push(post._id);
    await user.save();
    return post;
  } catch (error) {
    console.error("error in newpost service:", error);
    throw error;
  }
}

async function edit({ id }) {
  try {
    let post = await postModel.findOne({ _id: id });
    return post;
  } catch (error) {
    console.error("error in edit postService:", error);
    return null;
  }
}

async function update({ id, content }) {
  try {
    await postModel.findOneAndUpdate({ _id: id }, { content: content });
  } catch (error) {
    console.error("error in update postService:", error);
    throw error;
  }
}

async function following(userID, postOwner) {
  try {
    const user = await userModel.findOne({ _id: userID });
    if (!user) throw new Error("no user found");

    const owner = await userModel.findOne({ _id: postOwner });
    if (!owner) throw new Error("no user found");

    let isfollow = user.following.includes(postOwner);

    if (isfollow) {
      user.following.pull(postOwner);
    } else {
      user.following.push(postOwner);
    }

    await user.save();

    return !isfollow;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function like({ postid, userid }) {
  try {
    let post = await postModel.findOne({ _id: postid });
    if (!post) throw new Error("post not found");

    let isliked = post.likes.includes(userid);

    if (isliked) {
      post.likes.pull(userid);
    } else {
      post.likes.push(userid);
    }

    await post.save();

    return { isliked: !isliked, likeCount: post.likes.length };
  } catch (error) {
    console.error("error in like postService:", error);
    throw error;
  }
}

async function postDelete(postID, userID) {
  try {
    const user = await userModel.findOne({ _id: userID });
    if (!user) throw new Error("user not found");

    const userPosts = user.posts;

    if (!userPosts.map((id) => id.toString()).includes(postID))
      throw new Error("authorization failed");

    await postModel.findOneAndDelete({ _id: postID });

    user.posts.pull(postID);
    await user.save();
  } catch (error) {
    console.error("error in postDelete postService :", error);
    throw error;
  }
}

module.exports = {
  home,
  newPost,
  edit,
  update,
  like,
  following,
  postDelete,
};
