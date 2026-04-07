const express=require("express");
var cookieParser = require('cookie-parser')
const connectDB=require("../config/database")
const jwt=require("jsonwebtoken");
const {adminAuth}= require("../middlewares/auth")
const app=express();
const cors=require("cors");
const User=require("../models/user");
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter=require("../router/auth"); 
const profileRouter=require("../router/profile");
const userRouter =require("../router/user");
const connectionRequestRouter=require("../router/request")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRequestRouter);
app.use("/",userRouter);

// app.post("/sendConnectionRequest",adminAuth, async(req,res)=>{
//     const user=req.user;
//     res.send(user.firstName + "sent the connection request")
// });
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
