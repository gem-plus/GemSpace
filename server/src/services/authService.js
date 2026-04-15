const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

async function register({username ,name , age , email , password}){
        try{
                let user = await userModel.findOne({email});
                if (user) return null;
                
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                
                let newUser = await userModel.create({
                        name,
                        username,
                        age,
                        email,
                        password : hash
                })
                let token = jwt.sign({
                        email:email,
                        userid:newUser._id
                }, jwtSecret,{expiresIn:"1h"});
        
                return token;
        }catch(err){
                console.error("error in registering new user:",err);
                return null;
                
        }

        
}
async function login({email , password}){
        try{
                let user = await userModel.findOne({email});
                if (!user) return null;
            
                const match = await bcrypt.compare(password,user.password);
                if (!match) return null;
                
                let token = jwt.sign({
                        email:email,
                        userid:user._id
                }, jwtSecret,{expiresIn:"1h"});

                return token;

        }catch(error){
                console.error("error in login:",error);
                return null;
        }       
    
}

async function populateProfile(email){
        try{
                let user = await userModel.findOne({email: email}).populate("posts");
                return user;
        }
        catch(error){
                console.error("error in getting post",error);
                return null;
        }
    
}

module.exports = {
    register,
    login,
    populateProfile
}