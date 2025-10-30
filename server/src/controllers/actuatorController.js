import asyncHandler from "express-async-handler";
import Actuator from "../models/actuatorModel.js";

// @desc    Get all actuators
// @route   GET /api/actuators
// @access  Public
const getAllActuators = asyncHandler(async (req, res) => {
  const actuators = await Actuator.find({}).sort({ actuatorName: 1 });
  res.json(actuators);
});

// @desc    Initialize default actuators (run once)
// @route   POST /api/actuators/initialize
// @access  Public
const initializeActuators = asyncHandler(async (req, res) => {
  const defaultActuators = [
    {
      actuatorName: "servo",
      isActive: false,
      currentValue: 90, // Default servo angle
    },
    {
      actuatorName: "pump",
      isActive: false,
      currentValue: 5, // Default pump duration in seconds
    },
    {
      actuatorName: "buzzer",
      isActive: false,
      currentValue: 1000, // Default buzzer frequency
    },
  ];

  for (const actuatorData of defaultActuators) {
    await Actuator.findOneAndUpdate(
      { actuatorName: actuatorData.actuatorName },
      actuatorData,
      { upsert: true, new: true }
    );
  }

  const actuators = await Actuator.find({});
  res.json({
    success: true,
    message: "Actuators initialized successfully",
    actuators,
  });
});

// @desc    Get actuator status
// @route   GET /api/actuators/status
// @access  Public
const getActuatorStatus = asyncHandler(async (req, res) => {
  const actuators = await Actuator.find({});

  const status = {};
  actuators.forEach((actuator) => {
    status[actuator.actuatorName] = {
      isActive: actuator.isActive,
      currentValue: actuator.currentValue,
      lastToggled: actuator.lastToggled,
    };
  });

  res.json(status);
});

// @desc    Toggle actuator state manually
// @route   POST /api/actuators/toggle
// @access  Public
const toggleActuator = asyncHandler(async (req, res) => {
  const { actuatorName, action, value } = req.body;

  // Validate actuator name
  const validActuators = ["servo", "pump", "buzzer"];
  if (!validActuators.includes(actuatorName)) {
    res.status(400);
    throw new Error(
      `Invalid actuator name. Must be one of: ${validActuators.join(", ")}`
    );
  }

  // Find the actuator
  const actuator = await Actuator.findOne({ actuatorName });
  if (!actuator) {
    res.status(404);
    throw new Error("Actuator not found");
  }

  // Update actuator state based on action
  let updateData = {
    lastToggled: new Date(),
  };

  if (action === "toggle") {
    updateData.isActive = !actuator.isActive;
  } else if (action === "on") {
    updateData.isActive = true;
  } else if (action === "off") {
    updateData.isActive = false;
  }

  // Update value if provided
  if (value !== undefined) {
    updateData.currentValue = value;
  }

  const updatedActuator = await Actuator.findByIdAndUpdate(
    actuator._id,
    updateData,
    { new: true }
  );

  // Emit WebSocket event for real-time updates
  if (req.io) {
    req.io.emit("actuatorStateChanged", {
      actuatorName: updatedActuator.actuatorName,
      isActive: updatedActuator.isActive,
      currentValue: updatedActuator.currentValue,
      lastToggled: updatedActuator.lastToggled,
    });
  }

  res.json({
    success: true,
    message: `${actuatorName} ${action} successfully`,
    actuator: updatedActuator,
  });
});

// @desc    Update actuator value
// @route   PUT /api/actuators/:actuatorName/value
// @access  Public
const updateActuatorValue = asyncHandler(async (req, res) => {
  const { actuatorName } = req.params;
  const { value } = req.body;

  const actuator = await Actuator.findOneAndUpdate(
    { actuatorName },
    { currentValue: value },
    { new: true }
  );

  if (!actuator) {
    res.status(404);
    throw new Error("Actuator not found");
  }

  // Emit WebSocket event for real-time updates
  if (req.io) {
    req.io.emit("actuatorValueUpdated", {
      actuatorName: actuator.actuatorName,
      currentValue: actuator.currentValue,
    });
  }

  res.json({
    success: true,
    message: `${actuatorName} value updated successfully`,
    actuator,
  });
});

export {
  getAllActuators,
  initializeActuators,
  getActuatorStatus,
  toggleActuator,
  updateActuatorValue,
};
