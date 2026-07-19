import express from "express";
import { handleSearch } from "../controllers/search.controller.js";

const router = express.Router();

router.post("/", handleSearch)

export default router;
