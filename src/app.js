const express=require("express");
const app= express();
app.get("/",(req,res)=>res.send("Nothing should work"));
app.use("/",(req,res)=>res.send("Everything should work"));
app.use("/test/2",(req,res)=>res.send("abcd"));
app.use("/test",(req,res)=>res.send("Bolloooo from the server!"));

app.listen(50000,()=>{console.log("Server is successfully listening")})