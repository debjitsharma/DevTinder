const express=require("express");
const connectDB=require("../config/database")
const app=express();
const User=require("../models/user");
app.use(express.json());
app.post("/signup",async(req,res)=>{
    const user=new User(req.body);
    try{await user.save();
res.send("User Added successfully!!");
}catch(err){
    res.status(400).send("error saving the user"+ err.message)
}

});
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
app.patch("/update", async(req,res)=>{
    const data=req.body;
    const userId=req.body.userId;
    try{
       const user= await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"after"});
        res.send("User Updated!")
        console.log(user);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }

})
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
