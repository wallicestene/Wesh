import express from "express";
import {
  getListings,
  getNeighborhoods,
  getSingleListing,
} from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/neighborhoods", getNeighborhoods);

router.get("/", getListings);
router.get("/:id", getSingleListing);

export default router;
