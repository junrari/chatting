const userController =require("../Controllers/user.controller")

module.exports=function(io){
    //io가 하는일들
    io.on("connection",async(socket)=>{
        console.log("client is connencted",socket.id);

        socket.on("login",async(userName,cb)=>{
           //유저정보를 저장
           try{
            const user = await userController.saveUser(userName,socket.id);
            cb({ok:true,data:user})
           }catch(error){
            cb({ok:false, error:error.message});
           }
            
        })

        socket.on("disconnect",()=>{
            console.log("user is disconnencted",socket.id);
        })
    })
}