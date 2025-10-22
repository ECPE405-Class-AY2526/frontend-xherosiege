import mongoose from "mongoose";

const soilSensorDataSchema = mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
    },
    moisture: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // percentage
    },
    ec: {
      type: Number,
      required: true,
      min: 0, // electrical conductivity in µS/cm
    },
    npk: {
      nitrogen: {
        type: Number,
        required: true,
        min: 0,
      },
      phosphorus: {
        type: Number,
        required: true,
        min: 0,
      },
      potassium: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    temperature: {
      type: Number,
      required: true, // soil temperature in Celsius
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    alertLevel: {
      type: String,
      enum: ["optimal", "good", "warning", "critical"],
      default: "optimal",
    },
  },
  { timestamps: true }
);

const SoilSensorData = mongoose.model("SoilSensorData", soilSensorDataSchema);
export default SoilSensorData;
