const mongoose= require("mongoose");
const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://debjitsharma:Iammongo1%23@nodedaev.w258dbs.mongodb.net/?appName=nodedaev");

};
module.exports=connectDB;