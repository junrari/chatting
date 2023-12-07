const Chat = require("../Models/chat")
const chatController ={}

chatController.saveChat =async(message,user)=>{
    const newMessage = new Chat({
        chat: message,
        user:{
            id:user._id,  
            name:user.name
        }
    });
    await newMessage.save();   //save()은 몽고디비에서 데이터 삽입하는 메소드
    return newMessage;
}

module.exports=chatController