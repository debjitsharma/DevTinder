const socket= require("socket.io");
const {Chat}=require("../models/chat")
const crypto= require("crypto");
const getSecretRoomId= (loggedInUserId, targetUserId)=>{
    return crypto
    .createHash("sha256")
    .update([loggedInUserId,targetUserId].sort().join('$'))
    .digest("hex");
};

const initializeSocket= (server)=>{
const io= socket(server, {cors:{
    origin: ["http://localhost:5173", "http://localhost:5174"],
}});
io.on("connection",(socket)=>{
    socket.on("joinChat",({firstName,loggedInUserId,targetUserId})=>{
    const roomId=getSecretRoomId(loggedInUserId,targetUserId);
    socket.join(roomId);
    console.log(`${firstName}joined room:${roomId}`);
    });


    socket.on("sendMessage",
    async({firstName,loggedInUserId,targetUserId,text:newMessage})=>{
     try{   
     const roomId=getSecretRoomId(loggedInUserId,targetUserId);
     console.log("2nd roomid  " +roomId);
    console.log(firstName+ " "+newMessage);

    //checking if userId & targetUserId are friends
    let chat= await Chat.findOne({
        participants:{$all:[loggedInUserId,targetUserId]},
    });
    if(!chat){
        chat = new Chat({
            participants:[loggedInUserId,targetUserId],
            messages:[],
        });
    }
    chat.messages.push({
        senderId: targetUserId,
        text:newMessage,
    })

    await chat.save();

    io.to(roomId).emit("messageReceived",{firstName,loggedInUserId,targetUserId,newMessage}); 
}catch(err){
    console.log(err);
}});
    socket.on("disconnect",()=>{});
})

};
module.exports=initializeSocket;