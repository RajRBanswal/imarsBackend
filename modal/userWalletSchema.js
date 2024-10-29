const mongoose = require("mongoose");

const userWalletSchema = new mongoose.Schema(
  {
    orderId: {
      type: [String],
    },
    adminId: String,
    adminName: String,
    userId: String,
    userName: String,
    userMobile: String,
    amount: Number,
    openingBalance: Number,
    type: String,
    status: String,
    paymode: String,
    utrNo: String,
    transactionDate: String,
    transactionTime: String,
    reason: String,
    transactionId: String,
    cUserId: String,
    cUserName: String,
  },
  { timestamps: true }
);

const UserWallet = mongoose.model("users_wallets", userWalletSchema);
module.exports = UserWallet;
