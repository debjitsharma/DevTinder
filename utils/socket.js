const socket= require("socket.io");
const initializeSocket= (server)=>{
const io= socket(server, {cors:{
    origin: ["http://localhost:5173", "http://localhost:5174"],
}});

io.on("connection",(socket)=>{
    socket.on("joinChat",({userId,targetuserId})=>{
    const roomId=[userId,targetuserId].sort().join('_');
    socket.join(roomId);
    console.log(`${userId}joined room:{roomId}`);
    });
    socket.on("sendMessage",()=>{})
    socket.on("disconnect",()=>{});
})

};

module.exports=initializeSocket;