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

    // 🧠 Optimized Prompt for Sensitive Garbage Analysis
    const prompt = `
You are a STRICT environmental analyst. Analyze this image with HIGH SENSITIVITY to garbage and waste.

**IMPORTANT ASSESSMENT RULES:**
- If you see ANY visible garbage/waste, estimate HIGHER percentages (60-90%)
- Be strict: even scattered garbage = significant coverage
- Clean areas = 0-15% only
- Slightly dirty = 20-35%
- Visibly dirty/garbage present = 60-85%
- Heavily polluted = 85-100%

**FORMAT YOUR RESPONSE EXACTLY AS:**

Garbage Percentage: XX%
Cleanliness Status: [VERY CLEAN/CLEAN/MODERATELY DIRTY/DIRTY/VERY DIRTY]

GARBAGE TYPES:
List 2-4 main types only (e.g., Plastic bottles, Food waste, Paper)

DISTRIBUTION:
One short sentence about how garbage is spread

IMPACT:
One short sentence about main environmental concern

RECOMMENDATIONS:
- First action
- Second action

**OUTPUT RULES:**
- Be concise - max 2-3 words per garbage type
- Keep each section to 1-2 short sentences
- Make percentage match the status (DIRTY = 60-80%, VERY DIRTY = 80-100%)
- If garbage is visible, don't underestimate the percentage
    `;

    // 🧩 Generate content with Gemini
    const result = await model.generateContent([
      { text: prompt },
      fileToGenerativePart(imageBuffer, mimeType),
    ]);

    const response = await result.response;
    const responseText = response.text();

    // 🧹 Parse Gemini output
    const { garbagePercentage, cleanlinessStatus, explanation, error } = parseGeminiResponse(responseText);

    if (error) {
      return res.status(500).json({
        error: error,
        raw_gemini_response: responseText,
      });
    }

    // ✅ Successful response with comprehensive analytics
    res.json({
      garbage_percentage: garbagePercentage,
      cleanliness_status: cleanlinessStatus,
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