const { GoogleGenerativeAI } = require('@google/generative-ai');

let geminiModel;

const init = () => {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY not found in environment variables. Please set it in your .env file.");
    }
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Using gemini-2.5-flash for faster responses with vision capabilities
    geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log('Gemini 2.5 Flash model initialized successfully.');
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