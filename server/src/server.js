import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

import userRoutes from "./routes/userRoutes.js";
import soilSensorRoutes from "./routes/soilSensorRoutes.js";
import embeddedSensorRoutes from "./routes/embeddedSensorRoutes.js";
import actuatorRoutes from "./routes/actuatorRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.CLIENT_URL]
        : ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

connectDB();

//Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.CLIENT_URL]
        : ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Routes
app.use("/api/users", userRoutes);
app.use("/api/sensors/soil", soilSensorRoutes);
app.use("/api/sensors/embedded", embeddedSensorRoutes);
app.use("/api/actuators", actuatorRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientPath));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.resolve(clientPath, "index.html"));
  });
}

// Socket.IO connection handling
let esp32Socket = null;

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // ESP32 identification
  socket.on("esp32Identify", (data) => {
    console.log("ESP32 identified:", data);
    esp32Socket = socket;
    socket.isESP32 = true;

    // Notify all clients that ESP32 is connected
    socket.broadcast.emit("esp32Connected", {
      deviceId: data.deviceId || "ESP32",
      timestamp: new Date().toISOString(),
    });
  });

  // Handle actuator commands from frontend
  socket.on("actuatorCommand", (commandData) => {
    console.log("Received actuator command:", commandData);

    // Forward command to ESP32 if connected
    if (esp32Socket && esp32Socket.connected) {
      esp32Socket.emit("executeActuatorCommand", commandData);
      console.log("Forwarded command to ESP32:", commandData);
    } else {
      console.log("ESP32 not connected, command not sent");
      socket.emit("actuatorCommandError", {
        error: "ESP32 not connected",
        command: commandData,
      });
    }
  });

  // Handle actuator status updates from ESP32
  socket.on("actuatorStatusUpdate", (statusData) => {
    console.log("Received actuator status from ESP32:", statusData);

    // Broadcast status to all frontend clients
    socket.broadcast.emit("actuatorStatusFromESP32", statusData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // If ESP32 disconnected, notify all clients
    if (socket.isESP32) {
      esp32Socket = null;
      socket.broadcast.emit("esp32Disconnected", {
        timestamp: new Date().toISOString(),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
  if (process.env.NODE_ENV === "production") {
    console.log(`Production URL: ${process.env.CLIENT_URL || "Not set"}`);
  }
});
