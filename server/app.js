require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./src/routes/auth");
const postRoute = require("./src/routes/post");
const connectDB = require("./src/config/db");
const PORT = process.env.PORT ;

connectDB();
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/",authRoute);
app.use("/",postRoute);


app.listen(PORT ||3000);