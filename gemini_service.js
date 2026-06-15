const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service untuk menangani komunikasi dengan Google Gemini API
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReply = async (comment) => {
    try {
        // Menggunakan model gemini-1.5-flash untuk respon cepat dan efisien
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Anda adalah host livestream yang ramah dan menarik. Balas komentar penonton berikut dengan santai dan natural: "${comment}"`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return response.text();
    } catch (error) {
        console.error("Error saat generate konten dengan Gemini:", error);
        throw new Error("Gagal menghasilkan balasan AI");
    }
};

module.exports = { generateReply };