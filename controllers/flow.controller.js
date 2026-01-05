const axios = require("axios");
const Flow = require("../models/Flow.model");
const { OPENROUTER_URL, MODEL } = require("../config/openRouter");

// Health check
exports.healthCheck = (req, res) => {
  res.json({ message: "AI Flow API is running!" });
};

// Ask AI
exports.askAI = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const aiRes = await axios.post(
      OPENROUTER_URL,
      {
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "MERN AI Flow App",
        },
      }
    );

    const aiResponse = aiRes.data.choices[0].message.content;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to get AI response",
      details: error.response?.data || error.message,
    });
  }
};

// Save flow
exports.saveFlow = async (req, res) => {
  try {
    const { prompt, response } = req.body;

    if (!prompt || !response) {
      return res
        .status(400)
        .json({ error: "Prompt and response are required" });
    }

    const flow = await Flow.create({ prompt, response });

    res.status(201).json({
      message: "Flow saved successfully!",
      data: flow,
    });
  } catch (error) {
    console.error("Save Flow Error:", error);
    res.status(500).json({
      error: "Failed to save flow",
      details: error.message,
    });
  }
};

// Get all flows
exports.getFlows = async (req, res) => {
  try {
    const flows = await Flow.find().sort({ createdAt: -1 });
    res.json(flows);
  } catch (error) {
    console.error("Fetch Flows Error:", error);
    res.status(500).json({
      error: "Failed to fetch flows",
      details: error.message,
    });
  }
};
