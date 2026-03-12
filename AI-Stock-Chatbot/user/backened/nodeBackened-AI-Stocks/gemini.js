import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize the SDK with your NEW api key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System instructions set the "personality" of the AI globally
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // Update to 2.5 or "gemini-flash-latest"
  systemInstruction: "You are a friendly stock market assistant. Explain concepts simply for beginners. Always end every response with: 'Not financial advice.'",
});

app.post("/api/ai/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required" });
    }

    // Now we just send the question; the systemInstruction handles the personality
    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    res.json({ success: true, answer });

  } catch (error) {
    // If it's STILL 404, let's log the exact error to see what models your key DOES allow
    console.error("Gemini API Error details:", error.message);
    
    res.status(500).json({
      success: false,
      message: "AI Error. Check console for model availability.",
    });
  }
});

app.get("/", (req, res) => res.send("Gemini 2.5 Backend Online"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));