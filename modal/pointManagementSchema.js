const mongoose = require("mongoose");

const pointManagementtSchema = new mongoose.Schema(
  {
    adminId: String,
    type: String,
    points: Number,
    price: Number,
    level: String,
    status: String,
  },
  { timestamps: true }
);

const PointsManagament = mongoose.model("points_management", pointManagementtSchema);
module.exports = PointsManagament;
