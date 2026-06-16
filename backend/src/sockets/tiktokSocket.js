const TikTokLive = require('tiktok-live-connector');

console.log('AVAILABLE KEYS');
console.log(Object.keys(TikTokLive));
console.log('END KEYS');
console.log(
  'TikTok Keys Filter:',
  Object.keys(TikTokLive).filter(
    k =>
      k.toLowerCase().includes('live') ||
      k.toLowerCase().includes('connection') ||
      k.toLowerCase().includes('webcast')
  )
);
const { generateReply } = require('../services/geminiService');
const { textToSpeech } = require('../services/elevenLabsService');
const { saveComment, saveResponse } = require('../services/supabaseService');

const initSockets = (io) => {
    io.on('connection', (socket) => {

        console.log('✅ Frontend Connected');

        let tiktokConn = null;

        socket.on('connect_tiktok', async (username) => {

            console.log('📱 CONNECT REQUEST:', username);

            if (!username) {
                console.log('❌ Username kosong');
                return socket.emit('error', 'Username diperlukan');
            }

            socket.emit('status', 'connecting');

            try {

                const WebcastPushConnection =
                    TikTokLive.WebcastPushConnection || TikTokLive;

                tiktokConn = new WebcastPushConnection(username);

                console.log('🔄 Connecting to TikTok...');

                const state = await tiktokConn.connect();

                console.log('✅ TikTok Connected:', state);

                socket.emit('status', 'connected');

                tiktokConn.on('chat', async (data) => {
                    try {

                        console.log(`💬 ${data.nickname}: ${data.comment}`);

                        const comment = await saveComment(data);

                        socket.emit('new_chat', data);

                        const reply = await generateReply(data.comment);

                        console.log('🤖 AI Reply:', reply);

                        const audio = await textToSpeech(reply);

                        await saveResponse(comment.id, reply);

                        socket.emit('ai_response', {
                            response: reply,
                            audio: audio
                        });

                    } catch (err) {

                        console.error('❌ Chat Processing Error:', err);

                        socket.emit(
                            'error',
                            'Gagal memproses pesan'
                        );
                    }
                });

                tiktokConn.on('disconnected', () => {

                    console.log('⚠️ TikTok Disconnected');

                    socket.emit('status', 'disconnected');
                });

            } catch (err) {

                console.error('❌ TikTok Connection Error:', err);

                socket.emit('status', 'disconnected');

                socket.emit(
                    'error',
                    err.message || 'Gagal terhubung ke TikTok Live'
                );
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Frontend Disconnected');
        });
    });
};

module.exports = { initSockets };
