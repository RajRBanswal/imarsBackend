const mongoose = require("mongoose");

const prepaidCardWalletSchema = new mongoose.Schema(
  {
    adminId: String,
    adminName: String,
    userId: String,
    userName: String,
    userMobile: String,
    amount: Number,
    type: String,
    status: String,
    transactionDate: String,
    transactionTime: String,
    reason: String,
    transactionId: String,
    amountStatus: String,
  },
  { timestamps: true }
);

const PrepaidCardWallet = mongoose.model(
  "prepaid_card_wallets",
  prepaidCardWalletSchema
);
module.exports = PrepaidCardWallet;
