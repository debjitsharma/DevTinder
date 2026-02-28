const jwt=require("jsonwebtoken");
const User=require("../models/user")
const adminAuth= async(req,res,next)=>{
try{
const cookies=req.cookies;
 const {token}=cookies;
  if(!token){
    throw new Error("Invalid Token");
 }
//validate token
const decodedMessage= await jwt.verify(token,"Deb@DevTinder$798");
const {_id}=decodedMessage;
const user= await User.findById(_id);
if(!user){
    throw new Error("User does not exist")
}
req.user=user;
next();}
 catch(err){
    res.status(400).send(err.message);
}
}
module.exports = {adminAuth};