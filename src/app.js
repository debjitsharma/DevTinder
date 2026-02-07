const express=require("express");
const app= express();

app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.params);
    res.send("Bolloooo from the server!")});

app.listen(50000,()=>{console.log("Server is successfully listening")})