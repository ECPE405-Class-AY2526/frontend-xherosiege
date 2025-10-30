import mongoose from "mongoose";

const actuatorSchema = mongoose.Schema(
  {
    actuatorName: {
      type: String,
      required: true,
      enum: ["servo", "pump", "buzzer"],
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    currentValue: {
      type: Number,
      default: 0, // For servo angle, pump duration, buzzer frequency, etc.
    },
    lastToggled: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
actuatorSchema.index({ actuatorName: 1 });

const Actuator = mongoose.model("Actuator", actuatorSchema);
export default Actuator;
