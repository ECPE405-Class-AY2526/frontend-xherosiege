import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import SoilTrendChart from "../../Components/Charts/SoilTrendChart";

const EmbeddedPage = () => {
  const [embeddedData, setEmbeddedData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");
  const [sensorFilter, setSensorFilter] = useState("");

  useEffect(() => {
    fetchEmbeddedData();
    fetchHistoricalData();
    fetchStats();
  }, [sensorFilter]);

  useEffect(() => {
    fetchHistoricalData();
  }, [timeRange]);

  // WebSocket for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("embeddedSensorUpdated", (newData) => {
      console.log("New embedded sensor data received:", newData);
      fetchEmbeddedData();
      fetchHistoricalData();
      fetchStats();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchEmbeddedData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sensorFilter) params.append("sensorName", sensorFilter);

      const res = await axios.get(`/api/sensors/embedded/latest?${params}`);
      setEmbeddedData(res.data);
    } catch (error) {
      console.error("Error fetching embedded data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("timeRange", timeRange);
      if (sensorFilter) params.append("sensorName", sensorFilter);

      const res = await axios.get(`/api/sensors/embedded/historical?${params}`);
      setHistoricalData(res.data.data || res.data || []);
      console.log("Historical data fetched:", res.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/sensors/embedded/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Helper function to convert moisture reading to percentage and status
  const interpretMoisture = (analogValue) => {
    // Invert the scale: lower analog values = higher moisture
    // Map 500-4095 range to 100-0 percentage
    const percentage = Math.max(
      0,
      Math.min(100, 100 - ((analogValue - 500) / (4095 - 500)) * 100)
    );

    let status = "Unknown";
    let statusColor = "text-gray-500";

    if (analogValue >= 500 && analogValue <= 1000) {
      status = "Wet";
      statusColor = "text-blue-500";
    } else if (analogValue > 1000 && analogValue <= 2500) {
      status = "Moist";
      statusColor = "text-green-500";
    } else if (analogValue > 2500 && analogValue <= 3500) {
      status = "Dry";
      statusColor = "text-yellow-500";
    } else if (analogValue > 3500 && analogValue <= 4095) {
      status = "Very Dry";
      statusColor = "text-red-500";
    }

    return { percentage: percentage.toFixed(1), status, statusColor };
  };

  const getSensorIcon = (sensorName) => {
    switch (sensorName) {
      case "ultrasonic":
        return "📏";
      case "temperature":
        return "🌡️";
      case "moisture":
        return "💧";
      default:
        return "📊";
    }
  };

  const getSensorUnit = (sensorName) => {
    switch (sensorName) {
      case "ultrasonic":
        return "cm";
      case "temperature":
        return "°C";
      case "moisture":
        return ""; // We'll show custom moisture info
      default:
        return "";
    }
  };

  const getSensorColor = (sensorName) => {
    switch (sensorName) {
      case "ultrasonic":
        return "text-cyan-500";
      case "temperature":
        return "text-red-500";
      case "moisture":
        return "text-emerald-500";
      default:
        return "text-gray-500";
    }
  };

  // Transform data for charts
  const transformDataForChart = (data, parameter) => {
    const filtered = data.filter((item) => item.sensorName === parameter);
    const transformed = filtered.map((item) => ({
      ...item,
      [parameter]: item.sensorValue,
      timestamp: item.timestamp,
    }));
    console.log(`Chart data for ${parameter}:`, { filtered, transformed });
    return transformed;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Embedded Sensors Dashboard</h1>
        <button className="btn btn-primary" onClick={fetchEmbeddedData}>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Ultrasonic Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center">
              📏 Ultrasonic Sensor
            </h3>
            <p className="text-2xl font-bold text-cyan-500">
              {stats.ultrasonicStats?.avgValue?.toFixed(1) || 0} cm
            </p>
            <p className="text-xs opacity-50">
              {stats.ultrasonicStats?.totalReadings || 0} readings
            </p>
          </div>
        </div>

        {/* Temperature Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center">
              🌡️ Temperature Sensor
            </h3>
            <p className="text-2xl font-bold text-red-500">
              {stats.temperatureStats?.avgValue?.toFixed(1) || 0}°C
            </p>
            <p className="text-xs opacity-50">
              {stats.temperatureStats?.totalReadings || 0} readings
            </p>
          </div>
        </div>

        {/* Moisture Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center">
              💧 Soil Moisture Sensor
            </h3>
            <div className="text-2xl font-bold text-emerald-500">
              {stats.moistureStats?.avgValue
                ? `${
                    interpretMoisture(stats.moistureStats.avgValue).percentage
                  }%`
                : "0%"}
            </div>
            <p className="text-xs opacity-50">
              Analog: {stats.moistureStats?.avgValue?.toFixed(0) || 0} |{" "}
              {stats.moistureStats?.totalReadings || 0} readings
            </p>
          </div>
        </div>
      </div>

      {/* Latest Readings */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Latest Sensor Readings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {embeddedData.map((sensor) => (
              <div key={sensor._id} className="card bg-base-200 shadow">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold flex items-center gap-2">
                      {getSensorIcon(sensor.sensorName)}
                      {sensor.sensorName.charAt(0).toUpperCase() +
                        sensor.sensorName.slice(1)}
                    </h3>
                  </div>

                  <div
                    className={`text-2xl font-bold ${getSensorColor(
                      sensor.sensorName
                    )}`}
                  >
                    {sensor.sensorName === "moisture" ? (
                      <div>
                        <div>
                          {interpretMoisture(sensor.sensorValue).percentage}%
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            interpretMoisture(sensor.sensorValue).statusColor
                          }`}
                        >
                          {interpretMoisture(sensor.sensorValue).status}
                        </div>
                        <div className="text-xs opacity-70">
                          Analog: {sensor.sensorValue}
                        </div>
                      </div>
                    ) : (
                      `${sensor.sensorValue}${getSensorUnit(sensor.sensorName)}`
                    )}
                  </div>

                  <p className="text-xs opacity-50 mt-2">
                    {new Date(sensor.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sensor Analysis Charts */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="card-title mb-4 sm:mb-0">Embedded Sensor Trends</h2>

            {/* Time Range Toggle */}
            <div className="join">
              <button
                className={`btn join-item ${
                  timeRange === "24h" ? "btn-active" : ""
                }`}
                onClick={() => setTimeRange("24h")}
              >
                24 Hours
              </button>
              <button
                className={`btn join-item ${
                  timeRange === "1w" ? "btn-active" : ""
                }`}
                onClick={() => setTimeRange("1w")}
              >
                1 Week
              </button>
              <button
                className={`btn join-item ${
                  timeRange === "all" ? "btn-active" : ""
                }`}
                onClick={() => setTimeRange("all")}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Sensor Filter */}
          <div className="form-control w-full max-w-xs mb-4">
            <label className="label">
              <span className="label-text">Filter by Sensor Type</span>
            </label>
            <select
              className="select select-bordered"
              value={sensorFilter}
              onChange={(e) => setSensorFilter(e.target.value)}
            >
              <option value="">All Sensor Types</option>
              <option value="ultrasonic">Ultrasonic</option>
              <option value="temperature">Temperature</option>
              <option value="moisture">Moisture</option>
            </select>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ultrasonic Chart */}
            {(!sensorFilter || sensorFilter === "ultrasonic") && (
              <SoilTrendChart
                data={transformDataForChart(historicalData, "ultrasonic")}
                parameter="ultrasonic"
                color="#06b6d4"
                unit="cm"
              />
            )}

            {/* Temperature Chart */}
            {(!sensorFilter || sensorFilter === "temperature") && (
              <SoilTrendChart
                data={transformDataForChart(historicalData, "temperature")}
                parameter="temperature"
                color="#ef4444"
                unit="°C"
              />
            )}

            {/* Moisture Chart */}
            {(!sensorFilter || sensorFilter === "moisture") && (
              <SoilTrendChart
                data={transformDataForChart(historicalData, "moisture")}
                parameter="moisture"
                color="#10b981"
                unit="analog"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedPage;
