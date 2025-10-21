const { GoogleGenerativeAI } = require('@google/generative-ai');

let geminiModel;

const init = () => {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY not found in environment variables. Please set it in your .env file.");
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    console.log('Gemini-Pro Vision model initialized.');
};

const getGenerativeModel = () => {
    if (!geminiModel) {
        throw new Error("Gemini model not initialized. Call init() first.");
    }
    return geminiModel;
};

module.exports = {
    init,
    getGenerativeModel
};