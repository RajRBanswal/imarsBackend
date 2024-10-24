const mongoose = require("mongoose");

const packageRequestSchema = new mongoose.Schema(
  {
    adminId: String,
    adminName: String,
    userId: String,
    userName: String,
    packageId:String,
    packageName:String,    
    amount: Number,
    screenshot: String,
    transactionDate: String,
    transactionTime: String,
    transactionId: String,
    paymentStatus: String,
    status: String,
  },
  { timestamps: true }
);

const PackageRequest = mongoose.model("package_requests", packageRequestSchema);
module.exports = PackageRequest;
