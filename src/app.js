const express=require("express");
const connectDB=require("../config/database")
const app=express();
const User=require("../models/user");
app.post("/signup",async(req,res)=>{
    const user=new User(
        {
            firstName:"Debjit",
            lastName:"Sharma",
            emailId:"debjit2k15@gmail.com",
            password:"sjbdsjfb",
        }
    );
    try{await user.save();
res.send("User Added successfully!!");
}catch(err){
    res.status(400).send("error saving the user"+ err.message)
}

});

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
