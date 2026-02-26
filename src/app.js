const express=require("express");
const bcrypt=require("bcrypt");
var cookieParser = require('cookie-parser')
const connectDB=require("../config/database")
const jwt=require("jsonwebtoken");
const {validateSignUpData} = require("../utils/validators")
const app=express();
const User=require("../models/user");
app.use(express.json());
app.use(cookieParser());
app.post("/signup",async(req,res)=>{
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
app.post("/login",async(req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
          if(isPasswordValid){
            //Create a jwt token
            const token= await jwt.sign({_id:user._id},"Deb@DevTinder$798");
            console.log(token);
            //Add the token to cookie and send the response back to the user
            res.cookie("token",token);
            res.send("Login Successful");
         
          } else{
          throw new Error("Invalid Credentials"); 
          }

    }
    catch(err){
    res.status(400).send(err.message)
    }
})
app.get("/profile",async(req,res)=>{
 const cookies=req.cookies;

 console.log(cookies);
 res.send("Reading Cookie"); 
 const {token}=cookies;
 if(!token){
    
 }  
})
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
app.patch("/user/:userId",async(req,res)=>{
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
