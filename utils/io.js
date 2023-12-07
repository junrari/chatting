const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const chat = require("../Models/chat");
const user = require("../Models/user");

module.exports = function (io) {
    //io가 하는일들
    io.on("connection", async (socket) => {
        console.log("client is connencted", socket.id);

        socket.on("login", async (userName, cb) => {
            //유저정보를 저장

            try {
                const user = await userController.saveUser(userName, socket.id);
                const welcomeMessage = {
                    chat:`${user.name}님이 방에 입장했습니다`,
                    user: {id:null, name:"system"}
                };
                io.emit("message",welcomeMessage)
                cb({ ok: true, data: user })
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        })
        socket.on("sendMessage", async (message, cb) => {
            try {
                //socket id로 유저찾기
                const user = await userController.checkUser(socket.id)
                //메세지 저장(유저)
                const newMessage = await chatController.saveChat(message, user);
                console.log("message/user ",message,user);
                io.emit("message", newMessage)              //전체 클라이언트에게 알려줌
                cb({ ok: true })
            } catch (error) {
                cb({ ok: false, error: error.message });
            }

        })

        socket.on("disconnect", () => {
            console.log("user is disconnencted", socket.id);
        })

    })
}