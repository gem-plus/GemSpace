const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  profilePic: {
    type: String,
    default: "default-pfp",
  },
  name: String,
  age: Number,
  email: String,
  password: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});
module.exports = mongoose.model("user", userSchema);
