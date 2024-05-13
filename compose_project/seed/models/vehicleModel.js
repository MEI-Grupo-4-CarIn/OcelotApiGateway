const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VehicleSchema = new Schema(
  {
    model: { type: String, required: true },
    brand: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    vin: { type: String, required: true, unique: true, minlength: 17, maxlength: 17 },
    color: { type: String, required: true },
    registerDate: { type: Date, required: true },
    acquisitionDate: { type: Date, required: true },
    category: { type: String, required: true },
    kms: { type: Number, required: true },
    capacity: { type: Number, required: true },
    fuelType: {
      type: String,
      enum: ["diesel", "petrol", "electric"],
      default: "diesel",
    },
    averageFuelConsumption: { type: Number, required: true },
    status: {
      type: String,
      enum: ["none", "permanent", "inUse", "repairing"],
      default: "none",
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VehicleSchema.index({
  model: "text",
  brand: "text",
  licensePlate: "text",
  vin: "text",
  color: "text",
  category: "text",
});
VehicleSchema.index({ fuelType: 1 });
VehicleSchema.index({ status: 1 });
VehicleSchema.index({ fuelType: 1, status: 1 });
VehicleSchema.index({ isDeleted: 1 });

module.exports = VehicleSchema;
