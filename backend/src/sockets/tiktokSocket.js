const { WebcastPushConnection } = require('tiktok-live-connector');
const { generateReply } = require('../services/geminiService');
const { textToSpeech } = require('../services/elevenLabsService');
const { saveComment, saveResponse } = require('../services/supabaseService');

/**
 * Inisialisasi socket.io untuk menangani koneksi TikTok Live
 */
const initSockets = (io) => {
    io.on('connection', (socket) => {
        let tiktokConn = null;

        socket.on('connect_tiktok', async (username) => {
            if (!username) return socket.emit('error', 'Username diperlukan');
            
            tiktokConn = new WebcastPushConnection(username);
            socket.emit('status', 'connecting');
            
            try {
                await tiktokConn.connect();
                socket.emit('status', 'connected');

                tiktokConn.on('chat', async (data) => {
                    try {
                        // 1. Simpan komentar asli ke Supabase
                        const comment = await saveComment(data);
                        socket.emit('new_chat', data);

                        // 2. Generate jawaban menggunakan Gemini
                        const reply = await generateReply(data.comment);
                        
                        // 3. Generate audio menggunakan ElevenLabs
                        const audio = await textToSpeech(reply);
                        
                        // 4. Simpan respon AI ke Supabase
                        await saveResponse(comment.id, reply);
                        
                        // 5. Kirim respon dan audio ke frontend
                        socket.emit('ai_response', { 
                            response: reply, 
                            audio: audio 
                        });
                    } catch (err) {
                        console.error("Gagal memproses chat:", err);
                        socket.emit('error', 'Gagal memproses pesan');
                    }
                });

                tiktokConn.on('disconnected', () => {
                    socket.emit('status', 'disconnected');
                });

            } catch (err) {
                console.error("Gagal koneksi ke TikTok:", err);
                socket.emit('status', 'disconnected');
                socket.emit('error', 'Gagal terhubung ke TikTok Live');
            }
        });
    });
};

module.exports = { initSockets };
