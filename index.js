const {createServer}= require("http")
const app = require("./app")
const {Server} = require("socket.io")
require("dotenv").config();

const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000"
    }
})

require("./utils/io")(io);
httpServer.listen(process.env.PORT,()=>{                //서버 틀어놓기
    console.log("server listening on port", process.env.PORT)
})         