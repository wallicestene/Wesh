import express from "express";
import { handleApifyWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/apify", handleApifyWebhook);

export default router;