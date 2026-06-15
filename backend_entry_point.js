require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initSockets } = require('./sockets/tiktokSocket');

// Inisialisasi Express
const app = express();
const server = http.createServer(app);

// Konfigurasi Socket.IO dengan CORS yang aman
const io = new Server(server, { 
    cors: { 
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"] 
    } 
});

// Middleware
app.use(express.json());

/**
 * Health Check Endpoint
 * Digunakan oleh penyedia layanan cloud (seperti Railway) untuk memantau status aplikasi
 */
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
    });
});

// Inisialisasi Socket.IO untuk TikTok
initSockets(io);

// Menjalankan Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server GhostLive AI berjalan pada port ${PORT}`);
});