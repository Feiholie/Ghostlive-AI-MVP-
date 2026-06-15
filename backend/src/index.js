require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initSockets } = require('./sockets/tiktokSocket');

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

// Homepage
app.get('/', (req, res) => {
    res.send('GhostLive AI Backend Online');
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// TikTok Socket
initSockets(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`GhostLive AI Backend running on port ${PORT}`);
});
