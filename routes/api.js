const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getGenerativeModel } = require('../config/gemini'); 
const { parseGeminiResponse } = require('../utils/geminiParser');

// ✅ Setup in-memory file storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Helper: Convert image buffer to Gemini-compatible format
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

// ✅ Route: POST /api/estimate_garbage
router.post('/estimate_garbage', upload.single('image'), async (req, res) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const model = getGenerativeModel(); // Get initialized Gemini model

    // 🧠 Prompt for Gemini
    const prompt = `
      Analyze this image and estimate the percentage of the area covered by visible garbage 
      (e.g., plastic, paper, food waste). Provide only a numerical percentage followed by 
      a short explanation of what you observe.
      
      Example: "70% garbage, 30% clean area. Explanation: Plastics, paper, and some organic waste cover most of the ground."
      
      Respond in this format: "XX% garbage, YY% clean area. Explanation: ..."
    `;

    // 🧩 Generate content with Gemini
    const result = await model.generateContent([
      { text: prompt },
      fileToGenerativePart(imageBuffer, mimeType),
    ]);

    const response = await result.response;
    const responseText = response.text();

    // 🧹 Parse Gemini output
    const { garbagePercentage, explanation, error } = parseGeminiResponse(responseText);

    if (error) {
      return res.status(500).json({
        error: error,
        raw_gemini_response: responseText,
      });
    }

    // ✅ Successful response
    res.json({
      garbage_percentage: garbagePercentage,
      explanation,
      raw_gemini_response: responseText,
    });
  } catch (error) {
    console.error('Error processing image with Gemini API:', error);

    // Handle known Gemini API errors
    if (error.response && error.response.status) {
      return res.status(error.response.status).json({
        error: `Gemini API error: ${error.response.status}`,
        details: error.message,
        message: 'Please check your API key, usage limits, or image format.',
      });
    }

    // Handle other errors
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

module.exports = router;












// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { getGenerativeModel } = require('../config/gemini'); // Import model directly
// const { parseGeminiResponse } = require('../utils/geminiParser');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Function to convert buffer to base64 for Gemini API
// function fileToGenerativePart(buffer, mimeType) {
//     return {
//         inlineData: {
//             data: buffer.toString('base64'),
//             mimeType
//         },
//     };
// }

// router.post('/estimate_garbage', upload.single('image'), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: "No image file provided" });
//     }

//     try {
//         const imageBuffer = req.file.buffer;
//         const mimeType = req.file.mimetype;

//         const model = getGenerativeModel(); // Get the initialized model

//         const prompt = (
//             "Analyze this image and estimate the percentage of the area covered by visible garbage (e.g., plastic, paper, food waste). "
//             "Provide a numerical percentage only, followed by a brief textual explanation of what you observe."
//             "\n\nExample: 70% garbage, 30% clean area. Explanation: Plastics, paper, and some organic waste cover most of the ground."
//             "\n\nYour response should start with the percentage, followed by the explanation. E.g., 'XX% garbage, YY% clean area. Explanation: ...'"
//         );

//         const result = await model.generateContent([
//             prompt,
//             fileToGenerativePart(imageBuffer, mimeType),
//         ]);
//         const response = await result.response;
//         const responseText = response.text();

//         const { garbagePercentage, explanation, error } = parseGeminiResponse(responseText);

//         if (error) {
//             return res.status(500).json({ error: error, raw_gemini_response: responseText });
//         }

//         res.json({
//             garbage_percentage: garbagePercentage,
//             explanation: explanation,
//             raw_gemini_response: responseText
//         });

//     } catch (error) {
//         console.error("Error processing image with Gemini API:", error);
//         if (error.response && error.response.status) {
//             return res.status(error.response.status).json({
//                 error: `Gemini API error: ${error.response.status}`,
//                 details: error.message,
//                 message: "Please check your API key, limits, or image format."
//             });
//         }
//         res.status(500).json({ error: "Internal server error", details: error.message });
//     }
// });

// module.exports = router;