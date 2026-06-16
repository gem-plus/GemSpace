require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const helmet = require("helmet")
const {limiter} = require("./src/middleware/rateLimiter");
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const authRoute = require("./src/routes/auth");
const postRoute = require("./src/routes/post");
const connectDB = require("./src/config/db");
const userModel = require("./src/models/user")
const cookieParser =require("cookie-parser")
const PORT = process.env.PORT ;

const app = express();

connectDB();
app.use(helmet());
app.use(cors({
    origin: [process.env.CLIENT_URL,process.env.LOCAL_URL],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());

app.use("/",authRoute);
app.use("/",postRoute);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    let user = await userModel.findOne({ email: profile.emails[0].value });
    if (!user) {
        user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.emails[0].value.split("@")[0],
            age: 18,
            password: "google-oauth"
        });
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
});


app.listen(PORT ||3000);