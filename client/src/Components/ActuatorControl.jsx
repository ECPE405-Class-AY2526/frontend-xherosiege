import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { getSocketUrl, getSocketConfig } from "../utils/socket";

const ActuatorControl = () => {
  const [actuatorStatus, setActuatorStatus] = useState({});
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servoAngle, setServoAngle] = useState(90);
  const [pumpDuration, setPumpDuration] = useState(5);
  const [buzzerFrequency, setBuzzerFrequency] = useState(1000);
  const [pumpTimer, setPumpTimer] = useState(null);
  const [pumpCountdown, setPumpCountdown] = useState(0);
  const [esp32Mode, setEsp32Mode] = useState("automatic");
  const [esp32Connected, setEsp32Connected] = useState(false);

  useEffect(() => {
    fetchActuatorStatus();
    fetchRecentCommands();

    // Connect to WebSocket for real-time updates
    const socket = io(getSocketUrl(), getSocketConfig());

    // Listen for ESP32 connection status
    socket.on("esp32Connected", (data) => {
      console.log("ESP32 connected:", data);
      setEsp32Connected(true);
      if (data.mode) setEsp32Mode(data.mode);

      // Show toast notification
      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-end";
      toast.innerHTML = `
        <div class="alert alert-success">
          <span>🔌 ESP32 Connected (${data.mode || "unknown"} mode)</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    });

    socket.on("esp32Disconnected", (data) => {
      console.log("ESP32 disconnected:", data);
      setEsp32Connected(false);

      // Show toast notification
      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-end";
      toast.innerHTML = `
        <div class="alert alert-warning">
          <span>🔌 ESP32 Disconnected</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    });

    // Listen for actuator status updates from ESP32
    socket.on("actuatorStatusFromESP32", (data) => {
      console.log("Actuator status from ESP32:", data);

      // Update mode if included
      if (data.mode) setEsp32Mode(data.mode);

      // Update actuator states
      if (data.actuators) {
        const newStatus = {};
        Object.entries(data.actuators).forEach(([name, state]) => {
          newStatus[name] = {
            isActive: state.isActive,
            currentValue: state.currentValue,
            lastToggled: new Date().toISOString(),
          };
        });
        setActuatorStatus(newStatus);
      } else if (data.actuatorName) {
        // Single actuator update
        setActuatorStatus((prev) => ({
          ...prev,
          [data.actuatorName]: {
            isActive: data.isActive,
            currentValue:
              data.currentValue || prev[data.actuatorName]?.currentValue || 0,
            lastToggled: new Date().toISOString(),
          },
        }));
      }
    });

    // Listen for command errors
    socket.on("actuatorCommandError", (data) => {
      console.log("Actuator command error:", data);
      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-end";
      toast.innerHTML = `
        <div class="alert alert-error">
          <span>❌ ${data.error}</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    });

    // Store socket reference for sending commands
    window.actuatorSocket = socket;

    return () => {
      delete window.actuatorSocket;
      socket.disconnect();
    };
  }, []);

  // Cleanup pump timer on unmount
  useEffect(() => {
    return () => {
      if (pumpTimer) {
        clearTimeout(pumpTimer);
        clearInterval(pumpTimer);
      }
    };
  }, [pumpTimer]);

  const fetchActuatorStatus = async () => {
    try {
      const response = await axios.get("/api/actuators/status");
      setActuatorStatus(response.data);
    } catch (error) {
      console.error("Error fetching actuator status:", error);
    }
  };

  const fetchRecentCommands = async () => {
    try {
      const response = await axios.get("/api/actuators");
      setCommands(response.data || []);
    } catch (error) {
      console.error("Error fetching actuators:", error);
      setCommands([]);
    }
  };

  const sendCommand = async (actuatorName, action, value = 0) => {
    setLoading(true);
    try {
      // Clear existing pump timer if turning off pump or starting new pump cycle
      if (actuatorName === "pump" && pumpTimer) {
        clearTimeout(pumpTimer);
        clearInterval(pumpTimer);
        setPumpTimer(null);
        setPumpCountdown(0);
      }

      // Send command directly to ESP32 via WebSocket
      if (window.actuatorSocket) {
        const commandData = {
          actuatorName,
          action,
          value: value || 0,
          timestamp: new Date().toISOString(),
        };

        // Emit command to ESP32
        window.actuatorSocket.emit("actuatorCommand", commandData);
        console.log("Sent WebSocket command:", commandData);

        // Update local state optimistically
        setActuatorStatus((prev) => ({
          ...prev,
          [actuatorName]: {
            ...prev[actuatorName],
            isActive:
              action === "on"
                ? true
                : action === "off"
                ? false
                : !prev[actuatorName]?.isActive,
            currentValue: value || prev[actuatorName]?.currentValue || 0,
            lastToggled: new Date().toISOString(),
          },
        }));
      } else {
        throw new Error("WebSocket connection not available");
      }

      // Special handling for pump auto-off
      if (actuatorName === "pump" && action === "on") {
        const duration = value || pumpDuration;
        setPumpCountdown(duration);

        // Start countdown timer
        const countdownInterval = setInterval(() => {
          setPumpCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Set auto-off timer
        const autoOffTimer = setTimeout(async () => {
          try {
            await axios.post("/api/actuators/toggle", {
              actuatorName: "pump",
              action: "off",
            });

            // Show auto-off notification
            const autoOffToast = document.createElement("div");
            autoOffToast.className = "toast toast-top toast-end";
            autoOffToast.innerHTML = `
              <div class="alert alert-info">
                <span>💧 Pump automatically turned off after ${duration}s</span>
              </div>
            `;
            document.body.appendChild(autoOffToast);
            setTimeout(() => autoOffToast.remove(), 3000);

            fetchActuatorStatus();
          } catch (error) {
            console.error("Error auto-turning off pump:", error);
          }

          clearInterval(countdownInterval);
          setPumpTimer(null);
          setPumpCountdown(0);
        }, duration * 1000);

        setPumpTimer(autoOffTimer);
      }

      // Show success toast
      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-end";
      toast.innerHTML = `
        <div class="alert alert-success">
          <span>${actuatorName} ${action} successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error("Error sending command:", error);

      // Show error toast
      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-end";
      toast.innerHTML = `
        <div class="alert alert-error">
          <span>Error: ${error.response?.data?.message || error.message}</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    if (window.actuatorSocket && esp32Connected) {
      const commandData = {
        actuatorName: "system",
        action: "toggleMode",
        timestamp: new Date().toISOString(),
      };

      window.actuatorSocket.emit("actuatorCommand", commandData);
      console.log("Toggling ESP32 mode");

      // Show feedback toast
      const toast = document.createElement("div");
      toast.className = "toast toast-top toast-end";
      toast.innerHTML = `
        <div class="alert alert-info">
          <span>🔄 Switching ESP32 mode...</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? "badge-success" : "badge-neutral";
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Actuator Control</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span
                className={`badge ${
                  esp32Connected ? "badge-success" : "badge-error"
                }`}
              >
                {esp32Connected ? "🔗 ESP32 Connected" : "❌ ESP32 Offline"}
              </span>
              <span
                className={`badge ${
                  esp32Mode === "automatic"
                    ? "badge-primary"
                    : "badge-secondary"
                }`}
              >
                {esp32Mode === "automatic" ? "🤖 Auto Mode" : "🎮 Manual Mode"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${
              esp32Mode === "automatic" ? "btn-secondary" : "btn-primary"
            }`}
            onClick={toggleMode}
            disabled={!esp32Connected}
          >
            {esp32Mode === "automatic"
              ? "🎮 Switch to Manual"
              : "🤖 Switch to Auto"}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              fetchActuatorStatus();
              fetchRecentCommands();
            }}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Mode Info Alert */}
      <div
        className={`alert mb-6 ${
          esp32Mode === "automatic" ? "alert-info" : "alert-warning"
        }`}
      >
        <div>
          <h3 className="font-bold">
            {esp32Mode === "automatic"
              ? "🤖 Automatic Mode Active"
              : "🎮 Manual Mode Active"}
          </h3>
          <div className="text-sm">
            {esp32Mode === "automatic" ? (
              <>
                ESP32 controls actuators based on sensor readings. Sensor data
                is still logged to database.
              </>
            ) : (
              <>
                Manual control enabled. Use the controls below to operate
                actuators remotely.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {["servo", "pump", "buzzer"].map((actuator) => {
          const status = actuatorStatus[actuator];
          return (
            <div key={actuator} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title capitalize flex items-center">
                  {actuator === "servo" && "🔄"}
                  {actuator === "pump" && "💧"}
                  {actuator === "buzzer" && "🔊"}
                  {actuator}
                </h2>
                {status ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span
                        className={`badge ${getStatusBadge(status.isActive)}`}
                      >
                        {status.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Value:</span>
                      <span className="font-mono">{status.currentValue}</span>
                    </div>
                    {status.lastToggled && (
                      <div className="text-xs text-base-content/60">
                        Last toggled: {formatTimestamp(status.lastToggled)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-base-content/60">Not initialized</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Controls */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 ${
          esp32Mode === "automatic" ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Servo Control */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🔄 Servo Motor</h2>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Angle: {servoAngle}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={servoAngle}
                  onChange={(e) => setServoAngle(parseInt(e.target.value))}
                  className="range range-primary"
                />
                <div className="w-full flex justify-between text-xs px-2 mt-1">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                </div>
              </div>
              <div className="card-actions justify-end space-x-2">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={
                    loading || esp32Mode === "automatic" || !esp32Connected
                  }
                  onClick={() => sendCommand("servo", "on", servoAngle)}
                >
                  Set Position
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={
                    loading || esp32Mode === "automatic" || !esp32Connected
                  }
                  onClick={() => sendCommand("servo", "off")}
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pump Control */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">💧 Water Pump</h2>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Duration: {pumpDuration}s</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={pumpDuration}
                  onChange={(e) => setPumpDuration(parseInt(e.target.value))}
                  className="range range-secondary"
                />
                <div className="w-full flex justify-between text-xs px-2 mt-1">
                  <span>1s</span>
                  <span>15s</span>
                  <span>30s</span>
                </div>
              </div>

              {/* Countdown Display */}
              {pumpCountdown > 0 && (
                <div className="alert alert-info">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Auto-off in: <strong>{pumpCountdown}s</strong>
                    </span>
                  </div>
                </div>
              )}

              <div className="card-actions justify-end space-x-2">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={
                    loading ||
                    pumpCountdown > 0 ||
                    esp32Mode === "automatic" ||
                    !esp32Connected
                  }
                  onClick={() => sendCommand("pump", "on", pumpDuration)}
                >
                  {pumpCountdown > 0 ? "Running..." : "Start Pump"}
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={
                    loading || esp32Mode === "automatic" || !esp32Connected
                  }
                  onClick={() => sendCommand("pump", "off")}
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Buzzer Control */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🔊 Buzzer</h2>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">
                    Frequency: {buzzerFrequency}Hz
                  </span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="100"
                  value={buzzerFrequency}
                  onChange={(e) => setBuzzerFrequency(parseInt(e.target.value))}
                  className="range range-accent"
                />
                <div className="w-full flex justify-between text-xs px-2 mt-1">
                  <span>100Hz</span>
                  <span>1500Hz</span>
                  <span>3000Hz</span>
                </div>
              </div>
              <div className="card-actions justify-end space-x-2">
                <button
                  className="btn btn-accent btn-sm"
                  disabled={
                    loading || esp32Mode === "automatic" || !esp32Connected
                  }
                  onClick={() => sendCommand("buzzer", "on", buzzerFrequency)}
                >
                  Play Tone
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={
                    loading || esp32Mode === "automatic" || !esp32Connected
                  }
                  onClick={() => sendCommand("buzzer", "off")}
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Stop */}
      <div className="card bg-error/10 border border-error/20 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-error">⚠️ Emergency Controls</h2>
          <p className="text-sm text-base-content/80">
            Stop all actuators immediately
          </p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-error"
              disabled={loading}
              onClick={() => {
                sendCommand("servo", "off");
                sendCommand("pump", "off");
                sendCommand("buzzer", "off");
              }}
            >
              STOP ALL
            </button>
          </div>
        </div>
      </div>

      {/* Actuator States */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">� Actuator States</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Actuator</th>
                  <th>Status</th>
                  <th>Current Value</th>
                  <th>Last Toggled</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {commands.map((actuator) => (
                  <tr key={actuator._id}>
                    <td>
                      <span className="capitalize font-semibold flex items-center">
                        {actuator.actuatorName === "servo" && "🔄 "}
                        {actuator.actuatorName === "pump" && "💧 "}
                        {actuator.actuatorName === "buzzer" && "🔊 "}
                        {actuator.actuatorName}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(actuator.isActive)}`}
                      >
                        {actuator.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="font-mono">{actuator.currentValue}</td>
                    <td className="text-xs font-mono">
                      {actuator.lastToggled
                        ? formatTimestamp(actuator.lastToggled)
                        : "Never"}
                    </td>
                    <td className="text-xs font-mono">
                      {formatTimestamp(actuator.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {commands.length === 0 && (
              <div className="text-center py-8 text-base-content/60">
                <p>No actuators found</p>
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={async () => {
                    try {
                      await axios.post("/api/actuators/initialize");
                      fetchRecentCommands();
                      fetchActuatorStatus();
                    } catch (error) {
                      console.error("Error initializing actuators:", error);
                    }
                  }}
                >
                  Initialize Actuators
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActuatorControl;
