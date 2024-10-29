const mongoose = require("mongoose");
const Counter = require("./counterSchema");

// Function to get the next sequence number
async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Function to pad the number to 10 digits with leading zeros
function padNumber(num) {
  return String(num).padStart(10, "0");
}

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Use default ObjectId for _id
    },
    referBy: String,
    referenceId: String,
    name: String,
    email: String,
    mobile: String,
    address: String,
    password: String,
    stringPassword: String,
    state: String,
    city: String,
    taluka: String,
    pincode: String,
    status: String,
    pan: String,
    aadhar: String,
    accNo: String,
    ifscCode: String,
    branchName: String,
    bankName: String,
    accHolderName: String,
    kycstatus: String,
    profile_image: String,
    cardStatus: String,
    cardNumber: String,
    cardApprovedDate: String,
    cardExpiryDate: String,
    packageId: String,
    packageName: String,
    packageAmount: String,
    sponsorId: { type: String, ref: "Users" },
    level1: { type: String, ref: "Users" },
    level2: { type: String, ref: "Users" },
    level3: { type: String, ref: "Users" },
    level4: { type: String, ref: "Users" },
    level5: { type: String, ref: "Users" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this._id) {
    try {
      const nextId = await getNextSequence("user_id");
      this._id = "IZ" + padNumber(nextId);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
