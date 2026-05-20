const express= require("express");
const authRouter= express.Router();
const {validateSignUpData} = require("../utils/validators");
var cookieParser = require('cookie-parser')
const jwt=require("jsonwebtoken");
const User=require("../models/user");
const bcrypt = require("bcrypt");



authRouter.post("/signup",async(req,res)=>{
    try{
        //validation required
validateSignUpData(req);
//extraction of only allowed fields
const {firstName,lastName,emailId,password}=req.body;
//hashing of password
const passwordHash=await bcrypt.hash(password,10);
//User creation
const user=new User({
    firstName,
    lastName,
    emailId,
    password:passwordHash
});
const savedUser=await user.save();

const token=await savedUser.getJWT();
res.cookie("token",token,{httpOnly:true,expires: new Date(Date.now()+7*24*60*60*1000)});
res.json({message:"User Added successfully!!",
    data: savedUser,
});
}catch(err){
    res.status(400).send("error saving the user"+ err.message)
}

});



authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
       const isPasswordValid= await user.validateUserPassword(password);
          if(isPasswordValid){
            //Create a jwt token
            const token=await user.getJWT();
            //Add the token to cookie and send the response back to the user
            res.cookie("token",token, {httpOnly: true,expires: new Date(Date.now()+7*24*60*60*1000)});
            res.send(user);
         
          } else{
          throw new Error("Invalid Credentials"); 
          }

    }
    catch(err){
        console.log(err);
   res.status(400).json({ message: err.message });
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("Logout successful!");
})

module.exports = authRouter;