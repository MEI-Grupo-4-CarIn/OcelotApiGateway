const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema(
  {
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const RouteSchema = new Schema(
  {
    userId: { type: String, required: true },
    vehicleId: { type: String, required: true },
    startPoint: { type: LocationSchema, required: true },
    endPoint: { type: LocationSchema, required: true },
    startDate: { type: Date, required: true },
    estimatedEndDate: { type: Date, required: true },
    distance: { type: Number },
    duration: { type: String },
    status: {
      type: String,
      enum: ["pending", "inProgress", "completed", "cancelled"],
      default: "pending",
    },
    avoidTolls: { type: Boolean, required: true },
    avoidHighways: { type: Boolean, required: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

RouteSchema.index({
  "startPoint.city": "text",
  "startPoint.country": "text",
  "endPoint.city": "text",
  "endPoint.country": "text",
});
RouteSchema.index({ isDeleted: 1 });
RouteSchema.index({ status: 1 });

module.exports = RouteSchema;
