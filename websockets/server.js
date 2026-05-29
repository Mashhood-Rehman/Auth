const express = require("express")
const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")
const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
})

const onlineUsers = new Map()

io.on("connection", (socket) => {
    socket.on("register_user", (userId) => {
        onlineUsers.set(userId, socket.id)
        const list = Array.from(onlineUsers.keys())
        io.emit("online_users_list", list)
    })

    socket.on("send_private_message", ({senderId, receiverId, text}) => {
        const receiverSocketId = onlineUsers.get(receiverId)
        const messagePayload = {
            senderId,
            text,
            timestamp: new Date().toISOString()
        }

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("receive_private_message", messagePayload)
        }
        socket.emit("receive_private_message", messagePayload)
    })

    socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if(socketId === socket.id) {
                onlineUsers.delete(userId)
                console.log(`User ${userId} disconnected` );
                break
                
            }
        }
        io.emit("online_users_list", Array.from(onlineUsers.keys()))
    })
})
    io.on("connection", (socket) => {
        socket.on("register_user", (userId) => {
            onlineUsers.set(userId, socket.id)
        })
        socket.on("receive_private_message", ({senderId, receiverId, text}) => {
            const receiverSocketId = onlineUsers.get(receiverId)
            const messagePayload = {
                senderId,
                text,
                timeStamp: new Date().toISOString()
            }
            if(receiverSocketId) {

                io.to(receiverSocketId).emit("receive_private_message", messagePayload)
            }
            socket.emit("receive_private_message", messagePayload)
        })

        socket.on("disconnect", () => {
            for (let [userId, socketId] of onlineUsers.entries()) {
                if(socketId === socket.id) {
                    onlineUsers.delete(userId)
                    break
                }
                io.emit("online_users_list", Array.from(onlineUsers.keys()))
            }
        })
    })

const PORT = process.env.PORT || 4000
server.listen(PORT,() => {
    console.log(`WebSocket server running on port ${PORT}`)
} )