require('dotenv').config();
const express=require("express");
var cookieParser = require('cookie-parser')
const connectDB=require("../config/database")
const jwt=require("jsonwebtoken");
const {adminAuth}= require("../middlewares/auth")
const app=express();
const cors=require("cors");
const User=require("../models/user");
const http= require("http"); 
const initializeSocket=require("../utils/socket")
app.use(cors({
     origin: ["http://localhost:5173", "http://localhost:5174"],
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

const server= http.createServer(app);
initializeSocket(server);

// app.post("/sendConnectionRequest",adminAuth, async(req,res)=>{
//     const user=req.user;
//     res.send(user.firstName + "sent the connection request")
// });
connectDB()
.then(()=>
{
    console.log("Database connection established....");
    server.listen(50000,()=>{console.log("Server is successfully listening")})
})
.catch(
    (err)=>{
        console.error("Database cannot be connected!!")
    }
);
