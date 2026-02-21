const mongoose=require("mongoose");
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
            default:"https://www.geographyandyou.com/images/user-profile.png"
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
module.exports=mongoose.model("User",userSchema);