const mongoose = require("mongoose");

const userCashbackWalletSchema = new mongoose.Schema(
  {
    adminId: String,
    adminName: String,
    userId: String,
    userName: String,
    userMobile: String,
    packageId: String,
    packageName: String,
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
  },
  { timestamps: true }
);

const UserCashbackWallet = mongoose.model("users_cashback_wallets", userCashbackWalletSchema);
module.exports = UserCashbackWallet;
