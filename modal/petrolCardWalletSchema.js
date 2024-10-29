const mongoose = require("mongoose");

const petrolCardWalletSchema = new mongoose.Schema(
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

const PetrolCardWallet = mongoose.model(
  "petrol_card_wallets",
  petrolCardWalletSchema
);
module.exports = PetrolCardWallet;
