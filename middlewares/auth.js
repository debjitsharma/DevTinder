const adminAuth=(req,res,next)=>{
const token="xy";
    const isAdminAuthorized= token==="xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
}
module.exports={
    adminAuth,
};