const mongoose = require("mongoose");

const topUpRequestSchema = new mongoose.Schema(
  {
    adminId: String,
    adminName: String,
    userId: String,
    userName: String,
    amount: Number,
    walletAmount: Number,
    screenshot: String,
    transactionDate: String,
    transactionTime: String,
    transactionId: String,
    status: String,
  },
  { timestamps: true }
);

const TopUpRequest = mongoose.model(
  "topup_requests",
  topUpRequestSchema
);
module.exports = TopUpRequest;
