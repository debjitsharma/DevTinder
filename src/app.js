const express=require("express");
const {adminAuth,userAuth}=require("../middlewares/auth.js")
const app= express();

app.use("/admin/",adminAuth);
app.get("/admin/deleteUser",(req,res,next)=>{
    // res.send("B!")
    res.send("Deleted User");
    // next();
})
app.get("/user",userAuth,(req,res)=>{
    try{ throw new Error("djvkl");
    res.send("User Data Sent");
}catch(err){
    res.status(500).send("Error printed from try catch") 
}
   
});
app.use((req,res)=>{
  
        res.status(404).send("Route Not found")
    });

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong")
    }
});
app.listen(50000,()=>{console.log("Server is successfully listening")})