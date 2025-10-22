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
  const { hours = 24, location } = req.query;

  // Calculate start time based on hours parameter
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - parseInt(hours));

  let filter = {
    timestamp: { $gte: startTime },
  };

  if (location) {
    filter.location = location;
  }

  const historicalData = await SoilSensorData.find(filter)
    .sort({ timestamp: 1 }) // Sort ascending for proper time series
    .limit(100); // Limit to prevent too much data

  res.json(historicalData);
});

export {
  getAllSoilSensorData,
  getLatestSoilSensorData,
  createSoilSensorData,
  getSoilSensorDataByLocation,
  getSoilStats,
  getHistoricalSoilData,
};
