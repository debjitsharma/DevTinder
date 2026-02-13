const express=require("express");
require("../config/database")
const app=express();
app.listen(50000,()=>{console.log("Server is successfully listening")})