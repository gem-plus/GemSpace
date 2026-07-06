const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const multer = require("multer");

const { isLoggedIn } = require("../middleware/auth");
const { limiter } = require("../middleware/rateLimiter");
const authService = require("../services/authService");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", isLoggedIn, (req, res) => {
  return res.json({
    success: true,
    id: req.user.userid,
  });
});

router.get("/getpfp", isLoggedIn, async (req, res) => {
  try {
    const URL = await authService.getpfp(req.user.userid);
    return res.json({ success: true, avatarURL: URL });
  } catch (error) {
    console.error(error);
    return res.Status(500).json({ success: false });
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth" }),
  (req, res) => {
    const token = jwt.sign(
      { email: req.user.email, userid: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
      ...(process.env.NODE_ENV === "production" && {
        domain: ".gemplus.dpdns.org",
      }),
    });
    res.redirect(`${process.env.CLIENT_URL}/profile`);
  },
);

router.post("/register", limiter, async (req, res) => {
  try {
    let { username, name, age, email, password } = req.body;
    const token = await authService.register({
      username,
      name,
      age,
      email,
      password,
    });
    if (token) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000,
        ...(process.env.NODE_ENV === "production" && {
          domain: ".gemplus.dpdns.org",
        }),
      });
      return res.status(201).json({ success: true });
    }
  } catch (error) {
    if (error.message === "duplicate") {
      return res
        .status(409)
        .json({ success: false, message: "duplicate user" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

router.post("/login", limiter, async (req, res) => {
  try {
    const token = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });
    if (token) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
        sameSite: "lax",
        ...(process.env.NODE_ENV === "production" && {
          domain: ".gemplus.dpdns.org",
        }),
      });
      return res.json({ success: true });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("route error in /login:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(process.env.NODE_ENV === "production" && {
      domain: ".gemplus.dpdns.org",
    }),
  });
  return res.json({ success: true });
});

router.post(
  "/profilepic",
  upload.single("img"),
  isLoggedIn,
  limiter,
  async (req, res) => {
    try {
      const result = await authService.upload(req.file, req.user.userid);
      return res.json({ success: true, profilePic: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
      });
    }
  },
);

router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const user = await authService.populateProfile(req.user.email);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    return res.json({
      success: true,
      name: user.user.name,
      username: user.user.username,
      totalfollowing: user.totalfollowing,
      profilePic: user.imageUrl,
      posts: user.user.posts,
      userID: req.user.userid,
    });
  } catch (error) {
    console.error("route error in /profile:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

router.get("/getpost", isLoggedIn, async (req, res) => {
  try {
    const post = await authService.getPost(req.user.userid);
    return res.json({
      success: true,
      post: post,
      currentUser: req.user.userid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
