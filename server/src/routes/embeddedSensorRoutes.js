import express from "express";
import {
  getAllEmbeddedSensorData,
  getLatestEmbeddedSensorData,
  createEmbeddedSensorData,
  getEmbeddedSensorDataByType,
  getEmbeddedSensorStats,
  getHistoricalEmbeddedSensorData,
} from "../controllers/embeddedSensorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllEmbeddedSensorData);
router.get("/latest", protect, getLatestEmbeddedSensorData);
router.get("/stats", protect, getEmbeddedSensorStats);
router.get("/historical", protect, getHistoricalEmbeddedSensorData);
router.get("/type/:sensorName", protect, getEmbeddedSensorDataByType);
router.post("/", createEmbeddedSensorData);

export default router;
