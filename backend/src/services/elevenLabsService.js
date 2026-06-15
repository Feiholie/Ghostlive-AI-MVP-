const axios = require('axios');

/**
 * Service untuk menangani sintesis suara dengan ElevenLabs API
 */
const textToSpeech = async (text) => {
    try {
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.VOICE_ID}`;
        
        const response = await axios.post(
            url,
            {
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            },
            {
                headers: {
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        // Mengubah buffer audio menjadi base64 agar dapat dikirim melalui Socket.IO
        return Buffer.from(response.data).toString('base64');
    } catch (error) {
        console.error("Error saat generate audio dengan ElevenLabs:", error.response?.data || error.message);
        throw new Error("Gagal menghasilkan output audio dari ElevenLabs");
    }
};

module.exports = { textToSpeech };
