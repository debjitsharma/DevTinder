const socket= require("socket.io");
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
    socket.on("sendMessage",({firstName,loggedInUserId,targetUserId,text:newMessage})=>{
     const roomId=getSecretRoomId(loggedInUserId,targetUserId);
     console.log("2nd roomid  " +roomId);
    console.log(firstName+ " "+newMessage);
    io.to(roomId).emit("messageReceived",{firstName,loggedInUserId,targetUserId,newMessage}); 
    });
    socket.on("disconnect",()=>{});
})

};
module.exports=initializeSocket;