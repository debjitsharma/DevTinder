const validator=require("validator");
const validateSignUpData =(req)=>{
const {firstName, lastName, emailId, password}=req.body;

//if names exist
if(!firstName || !lastName){
    throw new Error ("Name is not valid");
}
//check name length
if(firstName.length<4 || firstName.length>50){
    throw new Error("First name should be between 4-50 characters");
}
//validate email format
if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid");
}

//validate password strength
if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password");
}
};



module.exports={validateSignUpData};