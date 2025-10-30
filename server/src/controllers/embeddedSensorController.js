import asyncHandler from "express-async-handler";
import EmbeddedSensor from "../models/embeddedSensorModel.js";

// @desc    Get all embedded sensor data
// @route   GET /api/sensors/embedded
// @access  Private
const getAllEmbeddedSensorData = asyncHandler(async (req, res) => {
  const { limit = 50, page = 1, sensorName } = req.query;

  let filter = {};
  if (sensorName) filter.sensorName = sensorName;

  const sensors = await EmbeddedSensor.find(filter)
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await EmbeddedSensor.countDocuments(filter);

  res.json({
    sensors,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  });
});

// @desc    Get latest embedded sensor readings
// @route   GET /api/sensors/embedded/latest
// @access  Private
const getLatestEmbeddedSensorData = asyncHandler(async (req, res) => {
  const { sensorName } = req.query;

  let matchFilter = {};
  if (sensorName) matchFilter.sensorName = sensorName;

  // Get latest reading for each sensor type
  const latestData = await EmbeddedSensor.aggregate([
    { $match: matchFilter },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: "$sensorName",
        latestReading: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$latestReading" } },
    { $sort: { timestamp: -1 } },
  ]);

  res.json(latestData);
});

// @desc    Create embedded sensor data
// @route   POST /api/sensors/embedded
// @access  Private
const createEmbeddedSensorData = asyncHandler(async (req, res) => {
  const { sensorName, sensorValue } = req.body;

  // Validate sensor name
  if (!["ultrasonic", "temperature", "moisture"].includes(sensorName)) {
    res.status(400);
    throw new Error(
      "Invalid sensor name. Must be ultrasonic, temperature, or moisture"
    );
  }

  // Validate sensor value
  if (typeof sensorValue !== "number") {
    res.status(400);
    throw new Error("Sensor value must be a number");
  }

  const sensorData = await EmbeddedSensor.create({
    sensorName,
    sensorValue,
  });

  // Emit WebSocket event for real-time updates
  if (req.io) {
    req.io.emit("embeddedSensorUpdated", {
      type: "create",
      data: sensorData,
    });
  }

  res.status(201).json(sensorData);
});

// @desc    Get embedded sensor data by sensor name
// @route   GET /api/sensors/embedded/type/:sensorName
// @access  Private
const getEmbeddedSensorDataByType = asyncHandler(async (req, res) => {
  const { sensorName } = req.params;
  const { limit = 20 } = req.query;

  // Validate sensor name
  if (!["ultrasonic", "temperature", "moisture"].includes(sensorName)) {
    res.status(400);
    throw new Error(
      "Invalid sensor name. Must be ultrasonic, temperature, or moisture"
    );
  }

  const sensorData = await EmbeddedSensor.find({ sensorName })
    .sort({ timestamp: -1 })
    .limit(limit);

  res.json(sensorData);
});

// @desc    Get embedded sensor statistics
// @route   GET /api/sensors/embedded/stats
// @access  Private
const getEmbeddedSensorStats = asyncHandler(async (req, res) => {
  const stats = await EmbeddedSensor.aggregate([
    {
      $group: {
        _id: "$sensorName",
        avgValue: { $avg: "$sensorValue" },
        minValue: { $min: "$sensorValue" },
        maxValue: { $max: "$sensorValue" },
        totalReadings: { $sum: 1 },
        latestReading: { $max: "$timestamp" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Transform to format expected by frontend (ultrasonicStats, temperatureStats, moistureStats)
  const formattedStats = {};
  stats.forEach((stat) => {
    const sensorType = stat._id;
    formattedStats[`${sensorType}Stats`] = {
      avgValue: parseFloat(stat.avgValue.toFixed(2)),
      minValue: stat.minValue,
      maxValue: stat.maxValue,
      totalReadings: stat.totalReadings,
      latestReading: stat.latestReading,
    };
  });

  res.json(formattedStats);
});

// @desc    Get historical embedded sensor data for charts
// @route   GET /api/sensors/embedded/historical
// @access  Private
const getHistoricalEmbeddedSensorData = asyncHandler(async (req, res) => {
  const { timeRange = "24h", sensorName } = req.query;

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

  if (sensorName) {
    filter.sensorName = sensorName;
  }

  const historicalData = await EmbeddedSensor.find(filter)
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
  getAllEmbeddedSensorData,
  getLatestEmbeddedSensorData,
  createEmbeddedSensorData,
  getEmbeddedSensorDataByType,
  getEmbeddedSensorStats,
  getHistoricalEmbeddedSensorData,
};
