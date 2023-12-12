const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const roomController = require("../Controllers/room.controller");
const chat = require("../Models/chat");
const user = require("../Models/user");


module.exports = function (io) {
    //io가 하는일들
    io.on("connection", async (socket) => {
        console.log("client is connencted", socket.id);
        socket.emit("rooms", await roomController.getAllRooms()); // 룸 리스트 보내기
        socket.on("joinRoom", async (rid, cb) => {
            try {
              const user = await userController.checkUser(socket.id); // 일단 유저정보들고오기
              await roomController.joinRoom(rid, user); 
              socket.join(user.room.toString());
              const welcomeMessage = {
                chat: `${user.name} is joined to this room`,
                user: { id: null, name: "system" },
              };
              const previousChat = await chatController.showChat(rid)
              io.to(socket.id).emit("message",previousChat); //기존채팅 보여주기
              io.to(user.room.toString()).emit("message", welcomeMessage);// 입장메시지 방전체사람에게
              io.emit("rooms", await roomController.getAllRooms());// 5 작업
              cb({ ok: true });
            } catch (error) {
              cb({ ok: false, error: error.message });
            }
          });
        socket.on("login", async (userName, cb) => {
            //유저정보를 저장

            try {
                const user = await userController.saveUser(userName, socket.id);
                cb({ ok: true, data: user })
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        })
        socket.on("sendMessage", async (receivedMessage, cb) => {
            try {
              const user = await userController.checkUser(socket.id);
              if (user) {
                const message = await chatController.saveChat(receivedMessage, user);
                io.to(user.room.toString()).emit("message", message); 
                return cb({ ok: true });
              }
            } catch (error) {
              cb({ ok: false, error: error.message });
            }
          });
        socket.on("leaveRoom", async (_, cb) => {
            try {
              const user = await userController.checkUser(socket.id);
              await roomController.leaveRoom(user);
              const leaveMessage = {
                chat: `${user.name}님이 방을 나갔습니다`,
                user: { id: null, name: "system" },
              };
              socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다 
              io.emit("rooms", await roomController.getAllRooms());
              socket.leave(user.room.toString()); // join했던 방을 떠남 
              cb({ ok: true });
            } catch (error) {
              cb({ ok: false, message: error.message });
            }
          });

        socket.on("disconnect", () => {
            console.log("user is disconnencted", socket.id);
        })

    })
}