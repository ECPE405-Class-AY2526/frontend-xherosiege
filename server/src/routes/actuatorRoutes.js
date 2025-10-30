import express from "express";
import {
  getAllActuators,
  initializeActuators,
  getActuatorStatus,
  toggleActuator,
  updateActuatorValue,
} from "../controllers/actuatorController.js";

const router = express.Router();

// Public routes (no authentication required for now)
router.get("/", getAllActuators);
router.post("/initialize", initializeActuators);
router.get("/status", getActuatorStatus);
router.post("/toggle", toggleActuator);
router.put("/:actuatorName/value", updateActuatorValue);

export default router;
