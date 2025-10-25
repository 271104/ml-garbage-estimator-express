# 🌍 ML Garbage Estimator

An AI-powered web application that analyzes images to estimate garbage/waste levels in an area using Google's Gemini 1.5 Flash model.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini 1.5 Flash for accurate image analysis
- **Comprehensive Reports**: Provides garbage percentage, cleanliness status, and detailed insights
- **Real-time Processing**: Instant analysis with visual feedback
- **Modern UI**: Beautiful gradient interface with responsive design
- **Detailed Metrics**: 
  - Garbage percentage (0-100%)
  - Cleanliness status (Very Clean → Very Dirty)
  - Types of garbage detected
  - Distribution patterns
  - Environmental impact assessment
  - Actionable recommendations

## 📋 Prerequisites

- Node.js (v14 or higher)
- Google Gemini API Key ([Get one here](https://ai.google.dev/))

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ml-garbage-estimator-express
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   
   Navigate to: `http://localhost:8000`

## 📁 Project Structure

```
ml-garbage-estimator-express/
├── config/
│   └── gemini.js              # Gemini API configuration
├── middleware/
│   ├── auth.js                # Authentication middleware
│   └── errorHandler.js        # Error handling middleware
├── routes/
│   └── api.js                 # API endpoints for garbage estimation
├── utils/
│   └── geminiParser.js        # Response parser for Gemini output
├── public/
│   └── index.html             # Frontend UI
├── server.js                  # Express server entry point
├── package.json               # Dependencies
├── .env                       # Environment variables (not in git)
└── README.md                  # Documentation
```

## 🔧 How It Works

### Backend Flow

1. **Server Initialization** (`server.js`)
   - Loads environment variables from `.env`
   - Initializes Express server on port 8000
   - Sets up middleware (CORS, body-parser, multer)
   - Initializes Gemini API client

2. **Gemini Configuration** (`config/gemini.js`)
   - Validates API key
   - Initializes Gemini 1.5 Flash model
   - Exports model instance for use in routes

3. **API Route** (`routes/api.js`)
   - **Endpoint**: `POST /api/estimate_garbage`
   - Receives image via multipart/form-data
   - Converts image to base64 format
   - Sends comprehensive prompt with image to Gemini API
   - Receives detailed analysis response
   - Parses and structures the response

4. **Response Parser** (`utils/geminiParser.js`)
   - Extracts garbage percentage using regex patterns
   - Determines cleanliness status (Very Clean → Very Dirty)
   - Parses detailed explanation
   - Handles multiple response formats with fallbacks

### Frontend Flow

1. **Image Upload**
   - User selects area image
   - Preview is displayed
   - File is validated

2. **API Request**
   - Image sent to `http://localhost:8000/api/estimate_garbage`
   - Loading spinner displayed
   - Button disabled during processing

3. **Results Display**
   - Garbage percentage shown prominently
   - Cleanliness status badge (color-coded)
   - Detailed analysis with formatting
   - Smooth scroll to results

## 🧠 AI Prompt Design

The application uses a comprehensive prompt that instructs Gemini to analyze:

1. **Overall Garbage Percentage**: 0-100% coverage estimation
2. **Cleanliness Status**: 5-tier categorization
3. **Garbage Types**: Specific waste identification
4. **Distribution Pattern**: Spatial arrangement analysis
5. **Environmental Impact**: Health and ecological hazards
6. **Recommendations**: Actionable cleanup suggestions

## 📊 API Response Format

```json
{
  "garbage_percentage": 45,
  "cleanliness_status": "MODERATELY DIRTY",
  "explanation": "Detailed analysis with types, distribution, impact, and recommendations",
  "raw_gemini_response": "Complete AI response"
}
```

## 🎨 Cleanliness Status Categories

| Status | Garbage % | Badge Color |
|--------|-----------|-------------|
| Very Clean | 0-10% | Green |
| Clean | 11-25% | Blue |
| Moderately Dirty | 26-50% | Orange |
| Dirty | 51-75% | Red |
| Very Dirty | 76-100% | Dark Red |

## 🔐 Security Notes

- **Never commit `.env` file** to version control
- Keep your Gemini API key secret
- Use environment variables for sensitive data
- Implement rate limiting for production use

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY not found"
- Ensure `.env` file exists in root directory
- Check that `GEMINI_API_KEY` is set correctly
- Restart the server after updating `.env`

### Error: "Connection refused on port 8000"
- Check if port 8000 is already in use
- Update `PORT` in `.env` if needed
- Restart the server

### Error: "Could not parse percentage"
- Image may be unclear or unsuitable
- Try a different image with visible area
- Check console logs for raw Gemini response

## 📦 Dependencies

- **express**: Web server framework
- **@google/generative-ai**: Google Gemini API client
- **multer**: File upload handling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart

## 🚀 Production Deployment

1. Set appropriate environment variables
2. Use process manager (PM2)
3. Implement rate limiting
4. Add request validation
5. Set up monitoring
6. Use HTTPS
7. Configure proper CORS origins

## 📝 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Your Name

---

**Built with ❤️ using Node.js, Express, and Google Gemini AI**
