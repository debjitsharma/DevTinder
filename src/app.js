const express=require("express");
var cookieParser = require('cookie-parser')
const connectDB=require("../config/database")
const jwt=require("jsonwebtoken");
const {adminAuth}= require("../middlewares/auth")
const app=express();
const User=require("../models/user");
app.use(express.json());
app.use(cookieParser());



app.get("/users",async(req, res)=>{
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

app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
        
    }
    catch(err){
        res.status(400).send("Users empty"+ err.message)
    }
})
app.delete("/delete", async(req,res)=>{
    const userId=req.body.userId;
    try{
        await User.findByIdAndDelete(userId)
        res.send("User deleted!")
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.post("/sendConnectionRequest",adminAuth, async(req,res)=>{
    const user=req.user;
    res.send(user.firstName + "sent the connection request")
});
connectDB()
.then(()=>
{
    console.log("Database connection established....");
    app.listen(50000,()=>{console.log("Server is successfully listening")})
})
.catch(
    (err)=>{
        console.error("Database cannot be connected!!")
    }
);
