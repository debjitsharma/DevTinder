const mongoose=require("mongoose");
var validator = require('validator');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            minLength:4,
            maxLength:50,
        },
        lastName:{
            type:String,
        },
        emailId:{
            type:String,
            lowercase:true,
            required:true,
            unique:[true,"email id must be unique"],
            trim:true,           
        },
        password:{
            type:String,
        },
        age:{
            type:Number,
            min:18,
        },
       gender: {
    type: String,
    enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not a valid gender type"
    }
},
        photoUrl:{
            type:String,
            default:"https://www.geographyandyou.com/images/user-profile.png",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Enter a vaild Photo Url "+ value);
                }
            }
        },
        about:{
            type:String,
            default:"You need to update your bio"
        },
        skills:{
            type:[String],
        },

    },
    {
            timestamps:true,
        }
);
userSchema.methods.getJWT= async function(){
    const user =this;
    const token= await jwt.sign({_id:user._id},"Deb@DevTinder$798",{expiresIn:"3d"});
    return token;
}
userSchema.methods.validateUserPassword= async function(passwordInputByUser){
    const user =this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}

module.exports=mongoose.model("User",userSchema);