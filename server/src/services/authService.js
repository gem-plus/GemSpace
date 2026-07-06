const userModel = require("../models/user");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const streamifier = require("streamifier");
const jwtSecret = process.env.JWT_SECRET;

async function register({ username, name, age, email, password }) {
  let user = await userModel.findOne({ email });
  if (user) throw new Error("duplicate");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  let newUser = await userModel.create({
    name,
    username,
    age,
    email,
    password: hash,
  });
  let token = jwt.sign(
    {
      email: email,
      userid: newUser._id,
    },
    jwtSecret,
    { expiresIn: "1h" },
  );

  return token;
}

async function login({ email, password }) {
  try {
    let user = await userModel.findOne({ email });
    if (!user) throw new Error("something went wrong");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("something went wrong");

    let token = jwt.sign(
      {
        email: email,
        userid: user._id,
      },
      jwtSecret,
      { expiresIn: "1h" },
    );

    return token;
  } catch (error) {
    console.error("error in login:", error);
    throw error;
  }
}

async function upload(file, userID) {
  try {
    if (!file) throw new Error("File not found");

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile-pics",
            transformation: [
              {
                width: 300,
                height: 300,
                crop: "fill",
                gravity: "face",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    console.log("File size:", file.size, "bytes");
    console.time("cloudinary");
    const result = await streamUpload(file.buffer);
    console.timeEnd("cloudinary");

    console.time("mongo");
    await userModel.findByIdAndUpdate(userID, {
      profilePic: result.public_id,
    });
    console.timeEnd("mongo");

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function populateProfile(email) {
  try {
    let user = await userModel.findOne({ email: email }).populate("posts");
    const imageUrl = cloudinary.url(user.profilePic, {
      width: 300,
      height: 300,
      crop: "fill",
      gravity: "face",
    });
    let totalfollowing = user.following.length;
    return { user, imageUrl, totalfollowing };
  } catch (error) {
    console.error("error in getting post", error);
    return null;
  }
}

async function getPost(userID) {
  try {
    const currentUser = await userModel.findOne({ _id: userID }).populate({
      path: "following",
      populate: {
        path: "posts",
      },
    });
    if (!currentUser) throw new Error("user dont exist");

    const followingPosts = currentUser.following
      .flatMap((user) =>
        user.posts.map((post) => ({
          ...post.toObject(),
          user: {
            _id: user._id,
            username: user.username,
          },
          avatarURL: cloudinary.url(user.profilePic, {
            width: 30,
            height: 30,
            crop: "fill",
            gravity: "face",
          }),
        })),
      )
      .reverse();

    return followingPosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getpfp(userID) {
  let user = await userModel.findOne({ _id: userID });
  if (!user) throw new Error("something went wrong");

  const avatarURL = cloudinary.url(user.profilePic, {
    width: 30,
    height: 30,
    crop: "fill",
    gravity: "face",
  });

  return avatarURL;
}

module.exports = {
  register,
  login,
  upload,
  populateProfile,
  getPost,
  getpfp,
};
