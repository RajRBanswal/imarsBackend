const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
    password: String,
  },
  { timestamps: true }
);

const Admin = mongoose.model("admins", AdminSchema);
module.exports = Admin;
