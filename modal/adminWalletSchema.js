const mongoose = require("mongoose");

const adminWalletSchema = new mongoose.Schema(
  {
    adminId: String,
    orderId: String,
    openingBalance: String,
    amount: String,
    type: String,
    WalletType: String,
    status: String,
    userId: String,
    userName: String,
    userMobile: String,
    userWalletAmount: String,
    reason: String,
    transactionDate: String,
    transactionTime: String,
    transactionId: String,
    amountStatus: String,
  },
  { timestamps: true }
);

const AdminWallet = mongoose.model("admin_wallets", adminWalletSchema);
module.exports = AdminWallet;
