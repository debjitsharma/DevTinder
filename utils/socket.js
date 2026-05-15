const socket= require("socket.io");
const initializeSocket= (server)=>{
const io= socket(server, {cors:{
    origin: ["http://localhost:5173", "http://localhost:5174"],
}});

io.on("connection",(socket)=>{
    socket.on("joinChat",({firstName,loggedInUserId,targetUserId})=>{
    const roomId=[loggedInUserId,targetUserId].sort().join('_');
    socket.join(roomId);
    console.log(`${firstName}joined room:${roomId}`);
    });
    socket.on("sendMessage",({firstName,loggedInUserId,targetUserId,text:newMessage})=>{
    const roomId=[loggedInUserId,targetUserId].sort().join('_'); 
    console.log(firstName+ " "+newMessage);
    io.to(roomId).emit("messageReceived",{firstName,newMessage}); 
    });
    socket.on("disconnect",()=>{});
})

};
module.exports=initializeSocket;