const asyncHandler = require('../middleware/async');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google AI client with the API key from your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get AI chat response from Google Gemini
// @route   POST /api/v1/ai/chat
// @access  Private
exports.getChatResponse = asyncHandler(async (req, res, next) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, error: 'Please provide a message' });
    }

    try {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const aiMessage = response.text();

        res.status(200).json({
            success: true,
            data: aiMessage,
        });
    } catch (error) {
        console.error("Error communicating with Google AI service:", error);
        res.status(500).json({ success: false, error: 'Could not get response from AI service.' });
    }
});