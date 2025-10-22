import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import SoilTrendChart from "../../Components/Charts/SoilTrendChart";
import SoilComparisonChart from "../../Components/Charts/SoilComparisonChart";
import NPKRadarChart from "../../Components/Charts/NPKRadarChart";

const SoilDashboard = () => {
  const [soilData, setSoilData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    location: "",
    alertLevel: "",
  });

  useEffect(() => {
    fetchSoilData();
    fetchLatestData();
    fetchStats();
    fetchHistoricalData();
  }, [filter]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      console.log("Connected to server for real-time updates");
    });

    socket.on("soilDataUpdated", (data) => {
      console.log("Received soil data update:", data);

      // Refresh all data when new soil data is added
      fetchSoilData();
      fetchLatestData();
      fetchStats();
      fetchHistoricalData();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount

  const fetchSoilData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.location) params.append("location", filter.location);
      if (filter.alertLevel) params.append("alertLevel", filter.alertLevel);

      const res = await axios.get(`/api/sensors/soil?${params}`);
      setSoilData(res.data.sensors);
    } catch (error) {
      console.error("Error fetching soil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestData = async () => {
    try {
      const res = await axios.get("/api/sensors/soil/latest");
      setLatestData(res.data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/sensors/soil/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("hours", "24"); // Get last 24 hours of data
      if (filter.location) params.append("location", filter.location);

      const res = await axios.get(`/api/sensors/soil/historical?${params}`);
      setHistoricalData(res.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const getAlertBadgeColor = (alertLevel) => {
    switch (alertLevel) {
      case "critical":
        return "badge-error";
      case "warning":
        return "badge-warning";
      case "good":
        return "badge-info";
      default:
        return "badge-success";
    }
  };

  const getPhStatus = (ph) => {
    if (ph < 5.5) return { text: "Acidic", color: "text-warning" };
    if (ph > 8.0) return { text: "Alkaline", color: "text-warning" };
    return { text: "Optimal", color: "text-success" };
  };

  const getMoistureStatus = (moisture) => {
    if (moisture < 20) return { text: "Dry", color: "text-error" };
    if (moisture > 80) return { text: "Wet", color: "text-info" };
    return { text: "Good", color: "text-success" };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Soil Monitoring Dashboard</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            fetchSoilData();
            fetchLatestData();
            fetchStats();
            fetchHistoricalData();
          }}
        >
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Average pH</h3>
            <p className="text-2xl font-bold">{stats.avgPh?.toFixed(2) || 0}</p>
            <p className="text-xs opacity-50">Soil acidity level</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Average Moisture</h3>
            <p className="text-2xl font-bold">
              {stats.avgMoisture?.toFixed(1) || 0}%
            </p>
            <p className="text-xs opacity-50">Soil water content</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Average EC</h3>
            <p className="text-2xl font-bold">{stats.avgEc?.toFixed(0) || 0}</p>
            <p className="text-xs opacity-50">µS/cm conductivity</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Temperature</h3>
            <p className="text-2xl font-bold">
              {stats.avgTemperature?.toFixed(1) || 0}°C
            </p>
            <p className="text-xs opacity-50">Soil temperature</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Soil Analysis Charts</h2>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* NPK Radar Chart */}
          <NPKRadarChart latestData={latestData} />

          {/* Location Comparison Chart */}
          <SoilComparisonChart data={soilData} />
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* pH Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="ph"
            color="#8b5cf6"
            unit="pH"
          />

          {/* Moisture Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="moisture"
            color="#06b6d4"
            unit="%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* EC Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="ec"
            color="#f59e0b"
            unit="µS/cm"
          />

          {/* Temperature Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="temperature"
            color="#ef4444"
            unit="°C"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Filters</h2>
          <div className="flex gap-4">
            <div className="form-control">
              <label className="label">Location</label>
              <select
                className="select select-bordered"
                value={filter.location}
                onChange={(e) =>
                  setFilter({ ...filter, location: e.target.value })
                }
              >
                <option value="">All Locations</option>
                <option value="Field A">Field A</option>
                <option value="Field B">Field B</option>
                <option value="Greenhouse 1">Greenhouse 1</option>
                <option value="Garden Plot">Garden Plot</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">Alert Level</label>
              <select
                className="select select-bordered"
                value={filter.alertLevel}
                onChange={(e) =>
                  setFilter({ ...filter, alertLevel: e.target.value })
                }
              >
                <option value="">All Levels</option>
                <option value="optimal">Optimal</option>
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Readings */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Latest Soil Readings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestData.slice(0, 6).map((data) => (
              <div key={data._id} className="card bg-base-200 shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{data.location}</h3>
                      <p className="text-sm opacity-70">{data.deviceId}</p>
                    </div>
                    <div
                      className={`badge ${getAlertBadgeColor(data.alertLevel)}`}
                    >
                      {data.alertLevel}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">pH:</span>
                      <span
                        className={`text-sm font-semibold ${
                          getPhStatus(data.ph).color
                        }`}
                      >
                        {data.ph.toFixed(1)} ({getPhStatus(data.ph).text})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Moisture:</span>
                      <span
                        className={`text-sm font-semibold ${
                          getMoistureStatus(data.moisture).color
                        }`}
                      >
                        {data.moisture.toFixed(1)}% (
                        {getMoistureStatus(data.moisture).text})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">EC:</span>
                      <span className="text-sm">{data.ec} µS/cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">NPK:</span>
                      <span className="text-sm">
                        {data.npk.nitrogen}-{data.npk.phosphorus}-
                        {data.npk.potassium}
                      </span>
                    </div>
                    <p className="text-xs opacity-50 mt-2">
                      {new Date(data.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Soil Data Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">All Soil Data</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Device ID</th>
                    <th>Location</th>
                    <th>pH</th>
                    <th>Moisture (%)</th>
                    <th>EC (µS/cm)</th>
                    <th>NPK</th>
                    <th>Temp (°C)</th>
                    <th>Alert</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {soilData.map((data) => (
                    <tr key={data._id}>
                      <td>{data.deviceId}</td>
                      <td>{data.location}</td>
                      <td>
                        <span className={getPhStatus(data.ph).color}>
                          {data.ph.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={getMoistureStatus(data.moisture).color}
                        >
                          {data.moisture.toFixed(1)}%
                        </span>
                      </td>
                      <td>{data.ec}</td>
                      <td>
                        {data.npk.nitrogen}-{data.npk.phosphorus}-
                        {data.npk.potassium}
                      </td>
                      <td>{data.temperature.toFixed(1)}°C</td>
                      <td>
                        <div
                          className={`badge ${getAlertBadgeColor(
                            data.alertLevel
                          )}`}
                        >
                          {data.alertLevel}
                        </div>
                      </td>
                      <td>{new Date(data.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilDashboard;
