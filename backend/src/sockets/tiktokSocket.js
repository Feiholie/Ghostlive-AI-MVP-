console.log("🚨 TIKTOK SOCKET FILE LOADED 🚨");
const { WebcastPushConnection } = require('tiktok-live-connector');

const { generateReply } = require('../services/geminiService');
const { textToSpeech } = require('../services/elevenLabsService');
const { saveComment, saveResponse } = require('../services/supabaseService');

const initSockets = (io) => {
    io.on('connection', (socket) => {

        console.log('✅ Frontend Connected:', socket.id);

        socket.onAny((event, ...args) => {
            console.log('📡 EVENT:', event);
            console.log(JSON.stringify(args, null, 2));
        });

        let tiktokConn = null;

    socket.on('connect_tiktok', async (payload) => {

    console.log('================================');
    console.log('📱 CONNECT TIKTOK EVENT MASUK');
    console.log(payload);
    console.log('================================');

    const username = payload.username;
    const product = payload.product;

    console.log('👤 Username:', username);
    console.log('📦 Product:', product);

    console.log('📱 CONNECT REQUEST:', payload);

    if (!username) {
        console.log('❌ Username kosong');
        return socket.emit('error', 'Username diperlukan');
    }

    socket.emit('status', 'connecting');

    try {

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
                            audio
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

            if (tiktokConn) {
                try {
                    tiktokConn.disconnect();
                } catch (e) {
                    console.log('TikTok disconnect skipped');
                }
            }
        });
    });
};

module.exports = { initSockets };
