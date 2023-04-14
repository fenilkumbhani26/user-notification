const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/db");
const PORT = process.env.PORT || 3000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    req.io = io;
    next();
});

app.use("/api", require("./routes/index"));

io.on('connection', function (socket) {
    console.log('user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`server running this port`, PORT);
});
