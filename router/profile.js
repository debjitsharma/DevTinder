const express= require("express");
const profileRouter= express.Router();
const express=require("express");
var cookieParser = require('cookie-parser')
const jwt=require("jsonwebtoken");
const {adminAuth}= require("../middlewares/auth")
const app=express();
const User=require("../models/user");
app.use(express.json());
app.use(cookieParser());


profileRouter.get("/profile",adminAuth,async(req,res)=>{
    try{
        const user=req.user;

        if(!user){
            throw new Error("User doesn't exist");
        }
        res.send(user);

    }
    catch(err){
    res.status(400).send("Error: "+ err.message);
    }
});

profileRouter.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data= req.body;
    try{
        const ALLOWED_UPDATES=["photoURL","about","gender","age","skills"];
        const isUpdateAllowed=Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Invalid updates!");
        }
        if(data?.skills && data.skills.length>10){
            throw new Error("Skills cannot be more than 10")
        }
        const user= await User.findByIdAndUpdate(userId,data,{runValidators:true,new:true});
        
        console.log(user);
        if (!user){
            return res.status(404).send("User not found");
        }
        res.send("User Updated!")
    }
    catch(err){
        res.status(400).send(err.message);
    }
}
)


module.exports= profileRouter;