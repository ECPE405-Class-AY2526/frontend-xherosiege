import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import SoilTrendChart from "../../Components/Charts/SoilTrendChart";

const DashboardPage2 = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState("24h");
  const [filter, setFilter] = useState({
    location: "",
  });

  // Separate useEffect for historical data to trigger on timeRange changes
  useEffect(() => {
    fetchHistoricalData();
  }, [timeRange, filter.location]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      console.log("Connected to server for real-time updates");
    });

    socket.on("soilDataUpdated", (data) => {
      console.log("Received soil data update:", data);
      fetchHistoricalData();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchHistoricalData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("timeRange", timeRange);
      if (filter.location) params.append("location", filter.location);

      const res = await axios.get(`/api/sensors/soil/historical?${params}`);
      setHistoricalData(res.data.data || res.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Soil Trend Analysis</h1>
        <button className="btn btn-primary" onClick={fetchHistoricalData}>
          Refresh
        </button>
      </div>

      {/* Time Range Toggle */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Historical Trends</h2>

          <div className="join">
            <button
              className={`btn join-item ${
                timeRange === "24h" ? "btn-primary" : ""
              }`}
              onClick={() => setTimeRange("24h")}
            >
              24 Hours
            </button>
            <button
              className={`btn join-item ${
                timeRange === "1w" ? "btn-primary" : ""
              }`}
              onClick={() => setTimeRange("1w")}
            >
              1 Week
            </button>
            <button
              className={`btn join-item ${
                timeRange === "all" ? "btn-primary" : ""
              }`}
              onClick={() => setTimeRange("all")}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Location Filter */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Filter by Location</h3>
            <div className="form-control w-full max-w-xs">
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
          </div>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* pH Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="ph"
            color="#8b5cf6"
            unit="pH"
            borderColor="primary"
          />

          {/* Moisture Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="moisture"
            color="#06b6d4"
            unit="%"
            borderColor="info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* EC Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="ec"
            color="#f59e0b"
            unit="µS/cm"
            borderColor="warning"
          />

          {/* Temperature Trend */}
          <SoilTrendChart
            data={historicalData}
            parameter="temperature"
            color="#ef4444"
            unit="°C"
            borderColor="error"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage2;
