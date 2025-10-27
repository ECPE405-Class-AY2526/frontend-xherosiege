import express from "express";
import {
  getAllSoilSensorData,
  getLatestSoilSensorData,
  createSoilSensorData,
  getSoilSensorDataByLocation,
  getSoilStats,
  getHistoricalSoilData,
} from "../controllers/soilSensorDataController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllSoilSensorData);
router.get("/latest", protect, getLatestSoilSensorData);
router.get("/stats", protect, getSoilStats);
router.get("/historical", protect, getHistoricalSoilData);
router.get("/location/:location", protect, getSoilSensorDataByLocation);
router.post("/", protect, createSoilSensorData);

export default router;
