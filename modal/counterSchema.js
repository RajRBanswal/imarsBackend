const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will be the name of the counter, e.g., "user_id"
  seq: { type: Number, default: 0 }, // This will store the auto-increment value
});

const Counter = mongoose.model("Counter", counterSchema);
module.exports = Counter
