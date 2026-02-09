const express=require("express");
const app= express();

app.get("/user",(req,res,next)=>{
next();
// res.send("A!")
});
app.get("/user",(req,res,next)=>{
    // res.send("B!")
    next();})
app.get("/user",(req,res,next)=>{
    res.send("C!")
    next();})
app.get("/user",(req,res,next)=>{
    res.send("D!")
    next();})
app.get("/user",(req,res)=>{
    res.send("E!")
})

app.listen(50000,()=>{console.log("Server is successfully listening")})