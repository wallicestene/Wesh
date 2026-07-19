import { type Request, type Response } from "express";
import { runChatAgent } from "../services/chat.service.js";

const handleChat = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Please provide a messages array." });
      return;
    }

    const response = await runChatAgent(messages);

    response.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Chat agent failed:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Agent failed to respond." });
    }
  }
};

export { handleChat };
