const mongoose = require("mongoose");

const withdrawRequestSchema = new mongoose.Schema(
  {
    adminId: String,
    adminName: String,
    userId: String,
    userName: String,
    amount: Number,
    walletAmount: Number,
    reason: String,
    paymode: String,
    ifsc: String,
    transactionDate: String,
    transactionTime: String,
    transactionId: String,
    status: String,
    screenshot: String,
  },
  { timestamps: true }
);

const WithdrawRequest = mongoose.model(
  "withdraw_requests",
  withdrawRequestSchema
);
module.exports = WithdrawRequest;
