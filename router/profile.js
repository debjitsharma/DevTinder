const express= require("express");
const profileRouter= express.Router();
const {validateEditProfileData}=require("../utils/validators");
var cookieParser = require('cookie-parser')
const jwt=require("jsonwebtoken");
const {adminAuth}= require("../middlewares/auth")
const User=require("../models/user");
const cloudinary= require('cloudinary').v2;
const multer=require("multer");

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
profileRouter.patch("/profile/edit",adminAuth, async(req, res)=>{
    try{
        //validate allowed fields

        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request")
        }
//logged in user from middleware
const loggedInUser=req.user;

//Update each field from request body
Object.keys(req.body).forEach((key)=>{
    loggedInUser[key]=req.body[key];
});

//Save to database
await loggedInUser.save();

//Send response with updated data
res.json({
    message:`${loggedInUser.firstName} your profile was updated successfully`,
    data: loggedInUser,
});
    }
    catch(err){
        res.status(400).send(err.message)
    }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage= multer.memoryStorage();
const upload= multer({storage});

profileRouter.post('/upload-photo',adminAuth,upload.single('photo'), async(req, res)=>{
    try{
        const result= await cloudinary.uploader.upload_stream(
            {folder:'devtinder'},
            (error,result)=>{
                if(error) return res.status(400).json({message:error.message});
                res.json({photoUrl: result.secure_url});
            }
        );
        require('stream').Readable.from(req.file.buffer).pipe(result);
    } catch(err){
        res.status(400).json({message});
    }
});

module.exports= profileRouter;