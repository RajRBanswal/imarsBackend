const moment = require("moment/moment");
const PointsManagament = require("../modal/pointManagementSchema");
const Users = require("../modal/userSchema");
const AdminWallet = require("../modal/adminWalletSchema");
const WithdrawRequest = require("../modal/withdrawRequestSchema");
const UserWallet = require("../modal/userWalletSchema");
const TopUpRequest = require("../modal/topUpRequestSchema");
const PackageRequest = require("../modal/packageRequestSchema");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.find().select("-password");
    if (allUsers) {
      res.json({
        status: 200,
        result: allUsers,
      });
    } else {
      res.json({ status: 422, result: "Data not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    let { id, cardNumber, issueDate, expiryDate } = req.body;
    let expiryDates = expiryDate
      ? moment(issueDate).format("DD-MM-YYYY")
      : moment(new Date()).add(30, "days").format("DD-MM-YYYY");
    let date = issueDate
      ? moment(issueDate).format("DD-MM-YYYY")
      : moment(new Date()).format("DD-MM-YYYY");
    const allUsers = await Users.findOneAndUpdate(
      { _id: id },
      {
        cardStatus: "Done",
        cardNumber: cardNumber,
        cardApprovedDate: date,
        cardExpiryDate: expiryDates,
      }
    );
    if (allUsers) {
      res.json({
        status: 200,
        result: "Update user details",
      });
    } else {
      res.json({ status: 422, result: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.AllPointPrices = async (req, res) => {
  let all_prices = await PointsManagament.find().sort({ _id: -1 });
  if (all_prices) {
    res.json({ status: 201, result: all_prices });
  } else {
    res.json({ status: 422, result: "Data not Found" });
  }
};

exports.storePointPrices = async (req, res) => {
  let { points, rewardPrice, adminId, type, level } = req.body;

  let add_prices = await PointsManagament.create({
    adminId: adminId,
    type: type,
    points: points,
    price: rewardPrice,
    status: "Active",
    level: level,
  });
  if (add_prices) {
    res.json({ status: 201, result: "Data Saved Successfully" });
  } else {
    res.json({ status: 422, result: "Data not saved" });
  }
};

exports.updatePointPrices = async (req, res) => {
  let { id, points, rewardPrice } = req.body;
  let spoints = "";
  let sprice = "";

  const PointMgmt = await PointsManagament.findOne({ _id: id });

  points ? (spoints = points) : (spoints = PointMgmt.points);
  rewardPrice ? (sprice = rewardPrice) : (sprice = PointMgmt.price);

  let update_prices = await PointsManagament.findOneAndUpdate(
    { _id: id },
    {
      points: spoints,
      price: sprice,
    }
  );
  if (update_prices) {
    res.json({ status: 201, result: "Data updated Successfully" });
  } else {
    res.json({ status: 422, result: "Data not update" });
  }
};

exports.deletePointPrices = async (req, res) => {
  let id = req.body.id;
  let checkPro = await PointsManagament.find({ _id: id }).count();
  if (checkPro > 0) {
    let del = await PointsManagament.deleteOne({ _id: id });
    if (del) {
      res.json({ status: 201, result: "Data Deleted" });
    } else {
      res.json({ status: 422, result: "Data not Deleted" });
    }
  } else {
    res.json({ status: 422, result: "User not Exists" });
  }
};

exports.adminWallet = async (req, res) => {
  let getAdminWallet = await AdminWallet.find();
  if (getAdminWallet) {
    res.json({ status: 200, result: getAdminWallet });
  } else {
    res.json({ status: 422, result: "Data not saved" });
  }
};

exports.acceptWithdrawRequest = async (req, res) => {
  let { id, userId, amount, walletAmount, transactionId, accountNo, ifsc } =
    req.body;

  let adminWalletAmount = 0;

  let getAdminWallet = await AdminWallet.find().sort({ $natural: -1 });
  getAdminWallet.map((item) => {
    if (item.type === "Credit" && item.amountStatus === "Done") {
      adminWalletAmount += parseInt(item.amount);
    } else if (item.type === "Debit" && item.amountStatus === "Done") {
      adminWalletAmount -= parseInt(item.amount);
    }
  });

  let time = moment(new Date()).format("hh:mm:ss:A");
  let date = moment(new Date()).format("DD-MM-YYYY");

  const userExists = await Users.findOne({ _id: userId })
    .select("-password")
    .select("-tokens");
  console.log(userExists);

  if (userExists) {
    const user = await WithdrawRequest.findByIdAndUpdate(
      { _id: id },
      {
        adminId: "670cb3f3ee78c45f512c47a9",
        adminName: "Admin",
        paymode: accountNo,
        ifsc: ifsc,
        transactionDate: date,
        transactionTime: time,
        status: "Done",
        screenshot: req.file.filename,
      }
    );
    if (user) {
      await AdminWallet.create({
        adminId: "670cb3f3ee78c45f512c47a9",
        openingBalance: adminWalletAmount,
        type: "Debit",
        status: "Success",
        amount: amount,
        userId: userId,
        userName: userExists.name,
        userMobile: userExists.mobile,
        userWalletAmount: walletAmount,
        reason: `Withdraw Request Accepted`,
        transactionDate: date,
        transactionTime: time,
        transactionId: transactionId,
        amountStatus: "Done",
      });
      await UserWallet.create({
        orderId: "",
        adminId: "670cb3f3ee78c45f512c47a9",
        adminName: "",
        amount: amount,
        userId: userId,
        userName: userExists.name,
        userMobile: userExists.mobile,
        openingBalance: walletAmount,
        type: "Debit",
        status: "Success",
        reason: `Withdraw Request Accepted`,
        paymode: accountNo,
        utrNo: ifsc,
        transactionDate: date,
        transactionTime: time,
        transactionId: transactionId,
      });
      res.json({
        status: 200,
        result: "Request accepted successfully",
      });
    } else {
      res.json({
        status: 422,
        result: "Request not accepted",
      });
    }
  } else {
    res.json({
      status: 422,
      result: "User not found",
    });
  }
};

exports.acceptTopupRequest = async (req, res) => {
  let { id, userId, amount, walletAmount, transactionId } = req.body;

  let adminWalletAmount = 0;

  let getAdminWallet = await AdminWallet.find().sort({ $natural: -1 });
  getAdminWallet.map((item) => {
    if (item.type === "Credit" && item.amountStatus === "Done") {
      adminWalletAmount += parseInt(item.amount);
    } else if (item.type === "Debit" && item.amountStatus === "Done") {
      adminWalletAmount -= parseInt(item.amount);
    }
  });

  let time = moment(new Date()).format("hh:mm:ss:A");
  let date = moment(new Date()).format("DD-MM-YYYY");

  const userExists = await Users.findOne({ _id: userId })
    .select("-password")
    .select("-tokens");

  if (userExists) {
    const user = await TopUpRequest.findByIdAndUpdate(
      { _id: id },
      {
        adminId: "670cb3f3ee78c45f512c47a9",
        adminName: "Admin",
        transactionDate: date,
        transactionTime: time,
        status: "Done",
      }
    );
    if (user) {
      await AdminWallet.create({
        adminId: "670cb3f3ee78c45f512c47a9",
        openingBalance: adminWalletAmount,
        type: "Credit",
        status: "Success",
        amount: amount,
        userId: userId,
        userName: userExists.name,
        userMobile: userExists.mobile,
        userWalletAmount: walletAmount,
        reason: `Topup Request Accepted`,
        transactionDate: date,
        transactionTime: time,
        transactionId: transactionId,
        amountStatus: "Done",
      });
      await UserWallet.create({
        orderId: "",
        adminId: "670cb3f3ee78c45f512c47a9",
        adminName: "",
        amount: amount,
        userId: userId,
        userName: userExists.name,
        userMobile: userExists.mobile,
        openingBalance: walletAmount,
        type: "Credit",
        status: "Success",
        reason: `Topup Request Accepted`,
        paymode: "",
        utrNo: "",
        transactionDate: date,
        transactionTime: time,
        transactionId: transactionId,
      });
      res.json({
        status: 200,
        result: "Request accepted successfully",
      });
    } else {
      res.json({
        status: 422,
        result: "Request not accepted",
      });
    }
  } else {
    res.json({
      status: 422,
      result: "User not found",
    });
  }
};

exports.getAdminWallet = async (req, res) => {
  let getAdminWallet = await AdminWallet.find().sort({ $natural: -1 });
  if (getAdminWallet) {
    res.json({ status: 200, result: getAdminWallet });
  } else {
    res.json({ status: 422, result: "Data not saved" });
  }
};

exports.addAdminWallet = async (req, res) => {
  let date = moment(new Date()).format("DD-MM-YYYY");
  let time = moment(new Date()).format("hh:mm:ss:A");
  let adminWalletAmount = 0;

  let getAdminWallet = await AdminWallet.find().sort({ $natural: -1 });
  getAdminWallet.map((item) => {
    if (item.type === "Credit" && item.amountStatus === "Done") {
      adminWalletAmount += parseInt(item.amount);
    } else if (item.type === "Debit" && item.amountStatus === "Done") {
      adminWalletAmount -= parseInt(item.amount);
    }
  });

  let transactionId = "IMZ" + Math.floor(Math.random() * new Date() + 1);
  let { userId, walletAmount } = req.body;
  let getAdminWallets = await AdminWallet.create({
    userId: userId,

    openingBalance: adminWalletAmount,
    amount: walletAmount,
    type: "Credit",
    reason: "Admin Added",
    WalletType: "Admin Wallet",
    status: "Success",
    transactionDate: date,
    transactionTime: time,
    transactionId: transactionId,
    amountStatus: "Done",
  });
  if (getAdminWallets) {
    res.json({ status: 200, result: "Amount Added" });
  } else {
    res.json({ status: 422, result: "Data not saved" });
  }
};

exports.getPackageRequest = async (req, res) => {
  let getPackageRequest = await PackageRequest.find().sort({ $natural: -1 });
  if (getPackageRequest) {
    res.json({ status: 200, result: getPackageRequest });
  } else {
    res.json({ status: 422, result: "Data not found" });
  }
};

exports.acceptPackageRequest = async (req, res) => {
  let { id, userId, amount, packageId, packageName } = req.body;

  
  
  const userExists = await Users.findOne({ _id: userId })
  .select("-password")
  .select("-tokens");
  
  if (userExists) {
    const user = await PackageRequest.findByIdAndUpdate(
      { _id: id },
      {
        adminId: "670cb3f3ee78c45f512c47a9",
        adminName: "Admin",
        paymentStatus: "Done",
        status: "Done",
      }
    );
    if (user) {
      await Users.findByIdAndUpdate(
        { _id: userId },
        {
          packageId: packageId,
          packageName: packageName,
          packageAmount: amount,
        }
      );
      res.json({
        status: 200,
        result: "Request accepted successfully",
      });
    } else {
      res.json({
        status: 422,
        result: "Request not accepted",
      });
    }
  } else {
    res.json({
      status: 422,
      result: "User not found",
    });
  }
};
