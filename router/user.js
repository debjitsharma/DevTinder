const express= require("express");
const requestRouter=express.Router();
var cookieParser = require('cookie-parser')
const jwt=require("jsonwebtoken");
const app=express();
const User=require("../models/user");


requestRouter.get("/users",async(req, res)=>{
    const userEmail=req.body.emailId;
    const userId=req.body.userId;
    try{
        const users= await User.find({emailId:userEmail});
        res.send(users);
    }
    catch(err){
    res.status(400).send("Email doesn't match any user "+ err.message)
    }
})
requestRouter.delete("/delete", async(req,res)=>{
    const userId=req.body.userId;
    try{
        await User.findByIdAndDelete(userId)
        res.send("User deleted!")
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})
requestRouter.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
        
    }
    catch(err){
        res.status(400).send("Users empty"+ err.message)
    }
})
module.exports = requestRouter;

