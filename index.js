const app = require("express")();
const server = require('http').createServer(app);
const cors = require("cors");
const { SocketAddress } = require("net");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(cors());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
//   });


const PORT = process.env.PORT || 8000;

app.get("/", (req,res) => {
    res.send('server is running');
});

io.on('connection', (socket) => {
    socket.emit('me',socket.id);

    socket.on('disconnect',() => {
        socklet.broadcast.emit('callEnded')
    });

    socket.on('callUser',({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit('callUser', {signal: signalData, from, name});
    });


    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })
});

server.listen(PORT,() => console.log(`Server listening on port ${PORT}`));