const express= require("express");
const authRouter= express.Router();
const {validateSignUpData} = require("../utils/validators");
var cookieParser = require('cookie-parser')
const jwt=require("jsonwebtoken");
const User=require("../models/user");
const bcrypt = require("bcrypt");



authRouter.post("/signup",async(req,res)=>{
    try{
        //validation
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
await user.save();
res.send("User Added successfully!!");
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
            res.cookie("token",token, {httpOnly: true,expires: new Date(Date.now()+7*24*360000)});
            res.send("Login Successful");
         
          } else{
          throw new Error("Invalid Credentials"); 
          }

    }
    catch(err){
    res.status(400).send(err.message)
    }
})

module.exports = authRouter;