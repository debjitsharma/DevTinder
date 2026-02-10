const express=require("express");
const adminAuth=require("./middlewares/auth.js")
const app= express();

app.get("/admin/",adminAuth);
app.get("/admin/deleteUser",(req,res,next)=>{
    // res.send("B!")
    res.send("Deleted User");
    // next();
})
app.listen(50000,()=>{console.log("Server is successfully listening")})