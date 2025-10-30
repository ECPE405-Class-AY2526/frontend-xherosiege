import mongoose from "mongoose";

const embeddedSensorSchema = mongoose.Schema(
  {
    sensorName: {
      type: String,
      required: true,
      enum: ["ultrasonic", "temperature", "moisture"],
      index: true, // Add index for faster queries
    },
    sensorValue: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add compound index for efficient queries by sensor name and timestamp
embeddedSensorSchema.index({ sensorName: 1, timestamp: -1 });

const EmbeddedSensor = mongoose.model("EmbeddedSensor", embeddedSensorSchema);
export default EmbeddedSensor;
