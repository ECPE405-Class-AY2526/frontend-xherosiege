import asyncHandler from "express-async-handler";
import SoilSensorData from "../models/soilSensorDataModel.js";

// @desc    Get all soil sensor data
// @route   GET /api/sensors/soil
// @access  Private
const getAllSoilSensorData = asyncHandler(async (req, res) => {
  const { limit = 50, page = 1, location, alertLevel } = req.query;

  let filter = {};
  if (location) filter.location = location;
  if (alertLevel) filter.alertLevel = alertLevel;

  const sensors = await SoilSensorData.find(filter)
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await SoilSensorData.countDocuments(filter);

  res.json({
    sensors,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  });
});

// @desc    Get latest soil sensor readings
// @route   GET /api/sensors/soil/latest
// @access  Private
const getLatestSoilSensorData = asyncHandler(async (req, res) => {
  const latestData = await SoilSensorData.find()
    .sort({ timestamp: -1 })
    .limit(10);

  res.json(latestData);
});

// @desc    Create soil sensor data
// @route   POST /api/sensors/soil
// @access  Private
const createSoilSensorData = asyncHandler(async (req, res) => {
  const { deviceId, location, ph, moisture, ec, npk, temperature, alertLevel } =
    req.body;

  // Calculate alert level based on soil conditions
  let calculatedAlertLevel = "optimal";

  // Basic soil health checks
  if (ph < 5.5 || ph > 8.0) calculatedAlertLevel = "warning";
  if (ph < 4.5 || ph > 9.0) calculatedAlertLevel = "critical";
  if (moisture < 20 || moisture > 80) calculatedAlertLevel = "warning";
  if (moisture < 10 || moisture > 90) calculatedAlertLevel = "critical";

  const soilData = await SoilSensorData.create({
    deviceId,
    location,
    ph,
    moisture,
    ec,
    npk,
    temperature,
    alertLevel: alertLevel || calculatedAlertLevel,
  });

  // Emit WebSocket event for real-time updates
  if (req.io) {
    req.io.emit("soilDataUpdated", {
      type: "create",
      data: soilData,
    });
  }

  res.status(201).json(soilData);
});

// @desc    Get soil sensor data by location
// @route   GET /api/sensors/soil/location/:location
// @access  Private
const getSoilSensorDataByLocation = asyncHandler(async (req, res) => {
  const { location } = req.params;
  const { limit = 20 } = req.query;

  const soilData = await SoilSensorData.find({ location })
    .sort({ timestamp: -1 })
    .limit(limit);

  res.json(soilData);
});

// @desc    Get soil statistics
// @route   GET /api/sensors/soil/stats
// @access  Private
const getSoilStats = asyncHandler(async (req, res) => {
  const stats = await SoilSensorData.aggregate([
    {
      $group: {
        _id: null,
        avgPh: { $avg: "$ph" },
        avgMoisture: { $avg: "$moisture" },
        avgEc: { $avg: "$ec" },
        avgTemperature: { $avg: "$temperature" },
        avgNitrogen: { $avg: "$npk.nitrogen" },
        avgPhosphorus: { $avg: "$npk.phosphorus" },
        avgPotassium: { $avg: "$npk.potassium" },
        totalReadings: { $sum: 1 },
      },
    },
  ]);

  res.json(stats[0] || {});
});

// @desc    Get historical soil data for charts
// @route   GET /api/sensors/soil/historical
// @access  Private
const getHistoricalSoilData = asyncHandler(async (req, res) => {
  const { timeRange = "24h", location } = req.query;

  let filter = {};
  let limit = 100;

  // Calculate start time based on timeRange parameter
  const now = new Date();
  let startTime;

  switch (timeRange) {
    case "24h":
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      limit = 100;
      break;
    case "1w":
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
      limit = 200;
      break;
    case "all":
      // No time filter for all time
      startTime = null;
      limit = 500;
      break;
    default:
      // Default to 24 hours if invalid timeRange
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      limit = 100;
  }

  if (startTime) {
    filter.timestamp = { $gte: startTime };
  }

  if (location) {
    filter.location = location;
  }

  const historicalData = await SoilSensorData.find(filter)
    .sort({ timestamp: 1 }) // Sort ascending for proper time series
    .limit(limit);

  res.json({
    data: historicalData,
    timeRange,
    totalRecords: historicalData.length,
    startTime: startTime ? startTime.toISOString() : null,
    endTime: now.toISOString(),
  });
});

export {
  getAllSoilSensorData,
  getLatestSoilSensorData,
  createSoilSensorData,
  getSoilSensorDataByLocation,
  getSoilStats,
  getHistoricalSoilData,
};
