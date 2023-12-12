const Chat = require("../Models/chat")
const chatController ={}

chatController.saveChat = async (message, user) => {
    const newChat = new Chat({
      chat: message,
      user: {
        id: user._id,
        name: user.name,
      },
      room: user.room, // 메세지에 채팅방 정보도 저장하는 부분 추가! 
    });
    await newChat.save();
    return newChat;
  };

chatController.showChat = async (roomId) =>{
  const roomChat = await Chat.find({room:roomId})
  if(!roomChat) throw new Error("chatting not found")
  return roomChat;
}


module.exports=chatController