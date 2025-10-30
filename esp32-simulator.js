// ESP32 Simulator for testing WebSocket actuator control
// Run this with: node esp32-simulator.js

const io = require("socket.io-client");

class ESP32Simulator {
  constructor() {
    this.socket = null;
    this.actuators = {
      servo: { isActive: false, currentValue: 90 },
      pump: { isActive: false, currentValue: 5 },
      buzzer: { isActive: false, currentValue: 1000 },
    };
    this.pumpTimer = null;
  }

  connect() {
    this.socket = io("http://localhost:5001");

    this.socket.on("connect", () => {
      console.log("✅ ESP32 Simulator connected to server");
      this.identifyAsESP32();
    });

    this.socket.on("disconnect", () => {
      console.log("❌ ESP32 Simulator disconnected from server");
    });

    this.socket.on("executeActuatorCommand", (commandData) => {
      console.log("📨 Received actuator command:", commandData);
      this.executeCommand(commandData);
    });

    // Send periodic status updates
    setInterval(() => {
      this.sendStatusUpdate();
    }, 10000); // Every 10 seconds
  }

  identifyAsESP32() {
    const identificationData = {
      deviceId: "ESP32_SIMULATOR_001",
      type: "esp32",
      capabilities: "servo,pump,buzzer",
      firmware: "1.0.0",
      timestamp: new Date().toISOString(),
    };

    this.socket.emit("esp32Identify", identificationData);
    console.log("🔧 Identified as ESP32:", identificationData);
  }

  executeCommand(command) {
    const { actuatorName, action, value } = command;

    if (!this.actuators[actuatorName]) {
      console.log("❌ Unknown actuator:", actuatorName);
      return;
    }

    console.log(
      `🔄 Executing ${actuatorName} ${action} ${
        value ? `(value: ${value})` : ""
      }`
    );

    // Clear existing pump timer if it's a pump command
    if (actuatorName === "pump" && this.pumpTimer) {
      clearTimeout(this.pumpTimer);
      this.pumpTimer = null;
    }

    // Update actuator state
    switch (action) {
      case "on":
        this.actuators[actuatorName].isActive = true;
        if (value > 0) {
          this.actuators[actuatorName].currentValue = value;
        }

        // Special handling for pump auto-off
        if (actuatorName === "pump") {
          const duration = value || this.actuators.pump.currentValue;
          console.log(`💧 Pump will auto-turn off after ${duration} seconds`);

          this.pumpTimer = setTimeout(() => {
            console.log("💧 Pump auto-turned off");
            this.actuators.pump.isActive = false;
            this.sendIndividualStatusUpdate("pump");
          }, duration * 1000);
        }
        break;

      case "off":
        this.actuators[actuatorName].isActive = false;
        break;

      case "toggle":
        this.actuators[actuatorName].isActive =
          !this.actuators[actuatorName].isActive;
        if (value > 0) {
          this.actuators[actuatorName].currentValue = value;
        }
        break;
    }

    // Send status update for this specific actuator
    this.sendIndividualStatusUpdate(actuatorName);

    // Simulate hardware response delay
    setTimeout(() => {
      console.log(`✅ ${actuatorName} command executed successfully`);
    }, 100);
  }

  sendIndividualStatusUpdate(actuatorName) {
    const statusData = {
      actuatorName,
      isActive: this.actuators[actuatorName].isActive,
      currentValue: this.actuators[actuatorName].currentValue,
      timestamp: new Date().toISOString(),
      deviceId: "ESP32_SIMULATOR_001",
    };

    this.socket.emit("actuatorStatusUpdate", statusData);
    console.log(`📤 Status update sent for ${actuatorName}:`, statusData);
  }

  sendStatusUpdate() {
    const fullStatus = {
      deviceId: "ESP32_SIMULATOR_001",
      actuators: Object.entries(this.actuators).map(([name, state]) => ({
        actuatorName: name,
        isActive: state.isActive,
        currentValue: state.currentValue,
      })),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
    };

    this.socket.emit("actuatorStatusUpdate", fullStatus);
    console.log("📊 Full status update sent");
  }

  disconnect() {
    if (this.pumpTimer) {
      clearTimeout(this.pumpTimer);
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Create and start the simulator
const esp32 = new ESP32Simulator();
esp32.connect();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down ESP32 Simulator...");
  esp32.disconnect();
  process.exit(0);
});

console.log("🚀 ESP32 Simulator starting...");
console.log("💡 This simulates an ESP32 device connecting via WebSocket");
console.log("🔧 Use the frontend actuator controls to test commands");
console.log("📊 Status updates will be sent every 10 seconds");
console.log("⏹️  Press Ctrl+C to stop");
