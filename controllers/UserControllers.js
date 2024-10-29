const AdminWallet = require("../modal/adminWalletSchema");
const Users = require("../modal/userSchema");
const UserWallet = require("../modal/userWalletSchema");
const moment = require("moment");
const WithdrawRequest = require("../modal/withdrawRequestSchema");
const TopUpRequest = require("../modal/topUpRequestSchema");
const PointsManagament = require("../modal/pointManagementSchema");
const PackageRequest = require("../modal/packageRequestSchema");
const UserCashbackWallet = require("../modal/userCashbackWalletSchema");
const PetrolCardWallet = require("../modal/petrolCardWalletSchema");

exports.getUserProfile = async (req, res) => {
  const userId = req.body.userId;
  const UsersData = await Users.findOne({ _id: userId }).select("-password");
  if (UsersData) {
    res.json({
      status: 200,
      result: UsersData,
    });
  } else {
    res.json({ status: 422, result: "Data not found" });
  }
};

exports.allReferUsers = async (req, res) => {
  let referenceId = req.body.userId;
  try {
    const allUsers = await Users.find({
      $or: [
        { level1: referenceId },
        { level2: referenceId },
        { level3: referenceId },
        { level4: referenceId },
        { level5: referenceId },
      ],
    }).select("-password");
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

exports.updateUserProfile = async (req, res) => {
  let profile_image = "";
  let { names, emails, mobiles, addresss } = "";

  const { userId, name, email, mobile, address } = req.body;

  const userExists = await Users.findOne({ _id: userId });

  if (
    req.body.profile_image === undefined ||
    req.body.profile_image === "" ||
    req.body.profile_image === null
  ) {
    profile_image = userExists.profile_image;
  } else {
    profile_image = req.file.filename;
  }
  if (userExists) {
    name ? (names = name) : (names = userExists.name);
    email ? (emails = email) : (emails = userExists.email);
    mobile ? (mobiles = mobile) : (mobiles = userExists.mobile);
    address ? (addresss = address) : (addresss = userExists.address);

    const user = await Users.findOneAndUpdate(
      { _id: userId },
      {
        name: names,
        email: emails,
        mobile: mobiles,
        address: addresss,
        profile_image: profile_image,
      }
    );
    if (user) {
      res.json({ status: 201, result: "User Updated successfully" });
    } else {
      res.json({ status: 422, result: "User not updated" });
    }
  } else {
    res.json({ status: 422, result: "User not exists" });
  }
};

exports.changePassword = async (req, res) => {
  let { userId, newPassword } = req.body;
  const userExists = await Users.findOne({ _id: userId });
  if (userExists) {
    const user = await Users.findOneAndUpdate(
      { _id: userId },
      {
        password: newPassword,
      }
    );
    if (user) {
      res.json({ status: 201, result: "User Updated successfully" });
    } else {
      res.json({ status: 422, result: "User not updated" });
    }
  } else {
    res.json({ status: 422, result: "User not exists" });
  }
};

exports.updateBankDetails = async (req, res) => {
  let { pans, accNos, ifscCodes, branchNames, bankNames, accHolderNames } = "";
  const { PANs, bankName, branchName, accNo, ifscCode, accHolderName, userId } =
    req.body;

  console.log(req.body);

  const userExists = await Users.findOne({ _id: userId });
  if (userExists) {
    PANs ? (pans = PANs) : (pans = userExists.pan);
    accNo ? (accNos = accNo) : (accNos = userExists.accNo);
    ifscCode ? (ifscCodes = ifscCode) : (ifscCodes = userExists.ifscCode);
    branchName
      ? (branchNames = branchName)
      : (branchNames = userExists.branchName);
    bankName ? (bankNames = bankName) : (bankNames = userExists.bankName);
    accHolderName
      ? (accHolderNames = accHolderName)
      : (accHolderNames = userExists.accHolderName);

    const user = await Users.findOneAndUpdate(
      { _id: userId },
      {
        pan: pans,
        accNo: accNos,
        ifscCode: ifscCodes,
        branchName: branchNames,
        bankName: bankNames,
        accHolderName: accHolderNames,
      }
    );
    if (user) {
      res.json({ status: 201, result: "Bank Details Updated successfully" });
    } else {
      res.json({ status: 422, result: "Bank Details not updated" });
    }
  } else {
    res.json({ status: 422, result: "User not exists" });
  }
};

exports.userWallet = async (req, res) => {
  const userId = req.body.userId;
  let checkPro = await UserWallet.find({ userId: userId });

  if (checkPro.length > 0) {
    let walletData = await UserWallet.find({ userId: userId }).sort({
      $natural: -1,
    });
    if (walletData) {
      res.json({ status: 200, result: walletData });
    } else {
      res.json({ status: 422, result: "Item not Found" });
    }
  } else {
    res.json({ status: 422, result: "Item not Exists" });
  }
};

exports.UserLogin = async (req, res) => {
  const { username, password } = req.body;

  const users = await Users.findOne({ mobile: username });
  if (users) {
    if (users.password === password) {
      const user = await Users.find({
        _id: users._id,
      }).select("-password");

      res.json({
        status: 200,
        result: "User logged in successfully",
        user: user,
      });
    } else {
      res.json({ status: 422, result: "Invalid Credential! try again" });
    }
  } else {
    res.json({ status: 422, result: "Invalid Credential! try again" });
  }
};

exports.UserRegister = async (req, res) => {
  let { name, mobile, email, address, password, image } = req.body;

  const mobileExists = await Users.find({ mobile: mobile });

  if (mobileExists.length === 0) {
    const user = new Users({
      name,
      email,
      mobile,
      address,
      password,
      stringPassword: password,
      profile_image: image == undefined || image == "" ? "" : req.file.filename,
      cardStatus: "Pending",
      status: "Active",
      kycstatus: "Pending",
    });

    await user.save();
    res.json({
      status: 200,
      result: "User created successfully",
    });
  } else {
    res.json({
      status: 422,
      result: "User already exists! Use other mobile number",
    });
  }
};

exports.ReferUserRegister = async (req, res) => {
  let adminWalletAmount = 0;

  let getAdminWallet = await AdminWallet.find().sort({ $natural: -1 });
  getAdminWallet.map((item) => {
    if (item.type === "Credit" && item.amountStatus === "Done") {
      adminWalletAmount += parseInt(item.amount);
    } else if (item.type === "Debit" && item.amountStatus === "Done") {
      adminWalletAmount -= parseInt(item.amount);
    }
  });

  let userWalletAmount = 0;

  let getUserWallet = await UserWallet.find().sort({ $natural: -1 });
  getUserWallet.map((item) => {
    if (item.type === "Credit") {
      userWalletAmount += parseInt(item.amount);
    } else if (item.type === "Debit") {
      userWalletAmount -= parseInt(item.amount);
    }
  });

  let time = moment(new Date()).format("hh:mm:ss:A");
  let date = moment(new Date()).format("DD-MM-YYYY");
  let transactionId = "IMZ" + Math.floor(Math.random() * new Date() + 1);

  let {
    referenceId,
    referenceName,
    referenceMobile,
    name,
    mobile,
    email,
    address,
    password,
    image,
  } = req.body;

  const mobileExists = await Users.find({ mobile: mobile });

  if (mobileExists.length === 0) {
    const user = new Users({
      referBy: referenceName,
      referenceId: referenceId,
      name,
      email,
      mobile,
      address,
      password,
      stringPassword: password,
      profile_image:
        image == undefined || image === "" ? "" : req.file.filename,
      cardStatus: "Pending",
      status: "Active",
      kycstatus: "Pending",
      sponsorId: referenceId || null,
    });

    console.log(user);

    const sponsorLevel1 = await Users.findById(referenceId);
    const sponsorIds = await Users.find({ sponsorId: referenceId });

    // if (sponsorIds.length < 10) {
    //   const MainUser = await Users.findOne({ _id: referenceId });
    //   if (
    //     (MainUser.packageName !== undefined || MainUser.packageName !== "") &&
    //     MainUser.packageName !== "Paithani Sarees + Prepaid Card"
    //   ) {
    //     await UserCashbackWallet.create({
    //       adminId: "",
    //       adminName: "",
    //       amount: 50,
    //       userId: MainUser._id,
    //       userName: MainUser.name,
    //       userMobile: MainUser.mobile,
    //       openingBalance: "",
    //       type: "Credit",
    //       status: "Success",
    //       reason: `Gift Card Cashback`,
    //       paymode: "",
    //       utrNo: "",
    //       transactionDate: date,
    //       transactionTime: time,
    //       transactionId: transactionId,
    //     });
    //     await AdminWallet.create({
    //       adminId: "670cb3f3ee78c45f512c47a9",
    //       openingBalance: adminWalletAmount,
    //       type: "Debit",
    //       status: "Success",
    //       amount: 50,
    //       userId: MainUser._id,
    //       userName: MainUser.name,
    //       userMobile: MainUser.mobile,
    //       userWalletAmount: "",
    //       reason: `Gift Card Cashback`,
    //       transactionDate: date,
    //       transactionTime: time,
    //       transactionId: transactionId,
    //       amountStatus: "Done",
    //     });
    //   }

    //   const updateWallet = async (
    //     points,
    //     userId,
    //     userName,
    //     userMobile,
    //     level
    //   ) => {
    //     const getTotal = (array) => {
    //       let total = 0;
    //       array.map((item) => {
    //         if (item.type === "Credit") {
    //           total += parseInt(item.amount);
    //         }
    //       });
    //       return total;
    //     };
    //     const userData = await Users.findById(userId);
    //     const walletAmountS = await UserWallet.find({
    //       userId: userId,
    //       transactionDate: date,
    //     });
    //     if (
    //       walletAmountS === null ||
    //       walletAmountS === "" ||
    //       getTotal(walletAmountS) < 2001
    //     ) {
    //       await AdminWallet.create({
    //         adminId: "670cb3f3ee78c45f512c47a9",
    //         openingBalance: adminWalletAmount,
    //         type: "Debit",
    //         status: "Success",
    //         amount: points.price,
    //         userId: userId,
    //         userName: userData.name,
    //         userMobile: userData.mobile,
    //         userWalletAmount: "",
    //         reason: `Refer & Earn Level ${level}`,
    //         transactionDate: date,
    //         transactionTime: time,
    //         transactionId: transactionId,
    //         amountStatus: "Done",
    //       });
    //       await UserWallet.create({
    //         orderId: "",
    //         adminId: "",
    //         adminName: "",
    //         amount: points.price,
    //         userId: userId,
    //         userName: userData.name,
    //         userMobile: userData.mobile,
    //         openingBalance: "",
    //         type: "Credit",
    //         status: "Success",
    //         reason: `Refer & Earn Level ${level}`,
    //         paymode: "",
    //         utrNo: "",
    //         transactionDate: date,
    //         transactionTime: time,
    //         transactionId: transactionId,
    //       });
    //     }
    //   };

    //   const findReferPoints = async (level) => {
    //     const points = await PointsManagament.find({
    //       type: "Refer Earn",
    //       level,
    //     })
    //       .sort({ $natural: -1 })
    //       .limit(1);
    //     return points[0];
    //   };

    //   if (!sponsorLevel1.level1) {
    //     user.level1 = sponsorLevel1._id;
    //     const referPoints = await findReferPoints("1");
    //     await updateWallet(
    //       referPoints,
    //       referenceId,
    //       referenceName,
    //       referenceMobile,
    //       1
    //     );
    //   } else if (!sponsorLevel1.level2) {
    //     user.level2 = sponsorLevel1._id;
    //     user.level1 = sponsorLevel1.level1;
    //     const referPoints1 = await findReferPoints("1");
    //     await updateWallet(
    //       referPoints1,
    //       referenceId,
    //       referenceName,
    //       referenceMobile,
    //       1
    //     );

    //     const referPoints2 = await findReferPoints("2");
    //     await updateWallet(
    //       referPoints2,
    //       sponsorLevel1.level1,
    //       "level2",
    //       "level2",
    //       2
    //     );
    //   } else if (!sponsorLevel1.level3) {
    //     user.level3 = sponsorLevel1._id;
    //     user.level2 = sponsorLevel1.level2;
    //     user.level1 = sponsorLevel1.level1;
    //     const referPoints1 = await findReferPoints("1");
    //     await updateWallet(
    //       referPoints1,
    //       referenceId,
    //       referenceName,
    //       referenceMobile,
    //       1
    //     );

    //     const referPoints2 = await findReferPoints("2");
    //     await updateWallet(
    //       referPoints2,
    //       sponsorLevel1.level2,
    //       "level2",
    //       "level2",
    //       2
    //     );

    //     const referPoints3 = await findReferPoints("3");
    //     await updateWallet(
    //       referPoints3,
    //       sponsorLevel1.level1,
    //       "level3",
    //       "level3",
    //       3
    //     );
    //   } else if (!sponsorLevel1.level4) {
    //     user.level4 = sponsorLevel1._id;
    //     user.level3 = sponsorLevel1.level3;
    //     user.level2 = sponsorLevel1.level2;
    //     user.level1 = sponsorLevel1.level1;
    //     const referPoints1 = await findReferPoints("1");
    //     await updateWallet(
    //       referPoints1,
    //       referenceId,
    //       referenceName,
    //       referenceMobile,
    //       1
    //     );

    //     const referPoints2 = await findReferPoints("2");
    //     await updateWallet(
    //       referPoints2,
    //       sponsorLevel1.level3,
    //       "level2",
    //       "level2",
    //       2
    //     );

    //     const referPoints3 = await findReferPoints("3");
    //     await updateWallet(
    //       referPoints3,
    //       sponsorLevel1.level2,
    //       "level3",
    //       "level3",
    //       3
    //     );

    //     const referPoints4 = await findReferPoints("4");
    //     await updateWallet(
    //       referPoints4,
    //       sponsorLevel1.level1,
    //       "level4",
    //       "level4",
    //       4
    //     );
    //   } else if (!sponsorLevel1.level5) {
    //     user.level5 = sponsorLevel1._id;
    //     user.level4 = sponsorLevel1.level4;
    //     user.level3 = sponsorLevel1.level3;
    //     user.level2 = sponsorLevel1.level2;
    //     user.level1 = sponsorLevel1.level1;
    //     const referPoints1 = await findReferPoints("1");
    //     await updateWallet(
    //       referPoints1,
    //       referenceId,
    //       referenceName,
    //       referenceMobile,
    //       1
    //     );

    //     const referPoints2 = await findReferPoints("2");
    //     await updateWallet(
    //       referPoints2,
    //       sponsorLevel1.level4,
    //       "level2",
    //       "level2",
    //       2
    //     );

    //     const referPoints3 = await findReferPoints("3");
    //     await updateWallet(
    //       referPoints3,
    //       sponsorLevel1.level3,
    //       "level3",
    //       "level3",
    //       3
    //     );

    //     const referPoints4 = await findReferPoints("4");
    //     await updateWallet(
    //       referPoints4,
    //       sponsorLevel1.level2,
    //       "level2",
    //       "level2",
    //       4
    //     );

    //     const referPoints5 = await findReferPoints("5");
    //     await updateWallet(
    //       referPoints5,
    //       sponsorLevel1.level1,
    //       "level1",
    //       "level1",
    //       5
    //     );
    //   } else {
    //     user.level5 = sponsorLevel1._id;
    //     user.level4 = sponsorLevel1.level5;
    //     user.level3 = sponsorLevel1.level4;
    //     user.level2 = sponsorLevel1.level3;
    //     user.level1 = sponsorLevel1.level2;
    //     const referPoints1 = await findReferPoints("1");
    //     await updateWallet(
    //       referPoints1,
    //       referenceId,
    //       referenceName,
    //       referenceMobile,
    //       1
    //     );

    //     const referPoints2 = await findReferPoints("2");
    //     await updateWallet(
    //       referPoints2,
    //       sponsorLevel1.level5,
    //       "level2",
    //       "level2",
    //       2
    //     );

    //     const referPoints3 = await findReferPoints("3");
    //     await updateWallet(
    //       referPoints3,
    //       sponsorLevel1.level4,
    //       "level3",
    //       "level3",
    //       3
    //     );

    //     const referPoints4 = await findReferPoints("4");
    //     await updateWallet(
    //       referPoints4,
    //       sponsorLevel1.level3,
    //       "level2",
    //       "level2",
    //       4
    //     );

    //     const referPoints5 = await findReferPoints("5");
    //     await updateWallet(
    //       referPoints5,
    //       sponsorLevel1.level2,
    //       "level1",
    //       "level1",
    //       5
    //     );
    //   }
    // }
    // await user.save();

    // res.json({
    //   status: 200,
    //   result: "User created successfully",
    // });
  } else {
    res.json({
      status: 422,
      result: "User already exists! Use other mobile number",
    });
  }
};

exports.WithdrawRequest = async (req, res) => {
  let { userId, walletAmount, withdrawAmount, reason, AccNo_UPI, IfscCode } =
    req.body;

  let time = moment(new Date()).format("hh:mm:ss:A");
  let date = moment(new Date()).format("DD-MM-YYYY");
  let transactionId = "IMZ" + Math.floor(Math.random() * new Date() + 1);

  const userExists = await Users.findOne({ _id: userId })
    .select("-password")
    .select("-tokens");
  console.log(userExists);

  if (userExists) {
    const user = await WithdrawRequest.create({
      adminId: "",
      adminName: "",
      userId: userId,
      userName: userExists.name,
      amount: withdrawAmount,
      walletAmount: walletAmount,
      reason: reason,
      paymode: AccNo_UPI,
      ifsc: IfscCode,
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
      status: "Pending",
    });
    if (user) {
      res.json({
        status: 200,
        result: "Request send successfully",
      });
    } else {
      res.json({
        status: 422,
        result: "Request not send",
      });
    }
  } else {
    res.json({
      status: 422,
      result: "User not found",
    });
  }
};
exports.getLastRequest = async (req, res) => {
  let userId = req.body.userId;

  const user = await WithdrawRequest.find({ userId: userId });

  if (user) {
    res.json({
      status: 200,
      result: user,
    });
  } else {
    res.json({
      status: 422,
      result: "Request not send",
    });
  }
};

exports.getWithdrawRequest = async (req, res) => {
  const user = await WithdrawRequest.find();
  if (user) {
    res.json({
      status: 200,
      result: user,
    });
  } else {
    res.json({
      status: 422,
      result: "Request not send",
    });
  }
};

exports.getWithdrawRequest = async (req, res) => {
  const user = await WithdrawRequest.find();
  if (user) {
    res.json({
      status: 200,
      result: user,
    });
  } else {
    res.json({
      status: 422,
      result: "Request not send",
    });
  }
};

exports.TopUpRequest = async (req, res) => {
  let { userId, amount, walletAmount } = req.body;

  let time = moment(new Date()).format("hh:mm:ss:A");
  let date = moment(new Date()).format("DD-MM-YYYY");
  let transactionId = "IMZ" + Math.floor(Math.random() * new Date() + 1);

  const userExists = await Users.findOne({ _id: userId })
    .select("-password")
    .select("-tokens");
  console.log(userExists);

  if (userExists) {
    const user = await TopUpRequest.create({
      adminId: "",
      adminName: "",
      userId: userId,
      userName: userExists.name,
      amount: amount,
      walletAmount: walletAmount,
      screenshot: req.file.filename,
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
      status: "Pending",
    });
    if (user) {
      res.json({
        status: 200,
        result: "Request send successfully",
      });
    } else {
      res.json({
        status: 422,
        result: "Request not send",
      });
    }
  } else {
    res.json({
      status: 422,
      result: "User not found",
    });
  }
};

exports.getTopUpRequest = async (req, res) => {
  let userId = req.body.userId;

  const user = await TopUpRequest.find({ userId: userId });

  if (user) {
    res.json({
      status: 200,
      result: user,
    });
  } else {
    res.json({
      status: 422,
      result: "Request not send",
    });
  }
};

exports.getAllTopUpRequest = async (req, res) => {
  const user = await TopUpRequest.find();
  if (user) {
    res.json({
      status: 200,
      result: user,
    });
  } else {
    res.json({
      status: 422,
      result: "Request not send",
    });
  }
};

exports.buyPackageRequest = async (req, res) => {
  let { userId, packageId, packageName, packageAmount, screenshot } = req.body;

  let time = moment(new Date()).format("hh:mm:ss:A");
  let date = moment(new Date()).format("DD-MM-YYYY");
  let transactionId = "IMZ" + Math.floor(Math.random() * new Date() + 1);

  const users = await Users.findOne({ _id: userId });

  const packageRequests = await PackageRequest.create({
    userId: userId,
    userName: users.name,
    packageId: packageId,
    packageName: packageName,
    amount: packageAmount,
    screenshot:
      screenshot == undefined || screenshot == "" ? "" : req.file.filename,
    transactionDate: date,
    transactionTime: time,
    transactionId: transactionId,
    paymentStatus: "Pending",
    status: "Pending",
  });

  if (packageRequests) {
    res.json({
      status: 200,
      result: "Request Send Successfully",
    });
  } else {
    res.json({
      status: 422,
      result: "Request not send",
    });
  }
};

exports.userCashbackWallet = async (req, res) => {
  const userId = req.body.userId;
  let checkPro = await UserCashbackWallet.find({ userId: userId });

  if (checkPro.length > 0) {
    let walletData = await UserCashbackWallet.find({ userId: userId }).sort({
      $natural: -1,
    });
    if (walletData) {
      res.json({ status: 200, result: walletData });
    } else {
      res.json({ status: 422, result: "Item not Found" });
    }
  } else {
    res.json({ status: 422, result: "Item not Exists" });
  }
};

exports.fundTransfer = async (req, res) => {
  let { userId, amount, recieverType, selectedUser, username, mobile } =
    req.body;

  let time = moment(new Date()).format("hh:mm:ss:A");
  let date = moment(new Date()).format("DD-MM-YYYY");
  let transactionId = "IMZ" + Math.floor(Math.random() * new Date() + 1);
  if (recieverType === "User") {
    await UserWallet.create({
      orderId: "",
      adminId: "",
      adminName: "",
      amount: amount,
      userId: userId,
      userName: username,
      userMobile: mobile,
      openingBalance: "",
      type: "Debit",
      status: "Success",
      reason: `Fund Transfer`,
      paymode: "",
      utrNo: "",
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
      cUserId: selectedUser._id,
      cUserName: selectedUser.name,
    });
    await UserWallet.create({
      orderId: "",
      adminId: "",
      adminName: "",
      amount: amount,
      userId: selectedUser._id,
      userName: selectedUser.name,
      userMobile: selectedUser.mobile,
      openingBalance: "",
      type: "Credit",
      status: "Success",
      reason: `Fund Transfer`,
      paymode: "",
      utrNo: "",
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
      cUserId: userId,
      cUserName: username,
    });

    res.json({ status: 200, result: "Fund Transfer successfully" });
  } else if (recieverType === "Admin") {
    await AdminWallet.create({
      adminId: "670cb3f3ee78c45f512c47a9",
      openingBalance: adminWalletAmount,
      type: "Debit",
      status: "Success",
      amount: points.price,
      userId: userId,
      userName: userData.name,
      userMobile: userData.mobile,
      userWalletAmount: "",
      reason: `Fund Transfer`,
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
      amountStatus: "Done",
    });
    await UserWallet.create({
      adminId: "670cb3f3ee78c45f512c47a9",
      adminName: "Admin",
      amount: amount,
      userId: userId,
      userName: username,
      userMobile: mobile,
      openingBalance: "",
      type: "Debit",
      status: "Success",
      reason: `Fund Transfer`,
      paymode: "",
      utrNo: "",
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
    });
    res.json({ status: 200, result: "Fund Transfer successfully" });
  } else if (recieverType === "PetrolCard") {
    await PetrolCardWallet.create({
      adminId: "",
      adminName: "",
      amount: amount,
      userId: userId,
      userName: username,
      userMobile: mobile,
      openingBalance: "",
      type: "Credit",
      status: "Success",
      reason: `Fund Transfer in Petrol Card`,
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
      amountStatus: "Pending",
    });
    await UserWallet.create({
      adminId: "670cb3f3ee78c45f512c47a9",
      adminName: "Admin",
      amount: amount,
      userId: userId,
      userName: username,
      userMobile: mobile,
      openingBalance: "",
      type: "Debit",
      status: "Success",
      reason: `Fund Transfer`,
      paymode: "",
      utrNo: "",
      transactionDate: date,
      transactionTime: time,
      transactionId: transactionId,
    });
    res.json({ status: 200, result: "Fund Transfer successfully" });
  }
};

exports.userPetrolCardWallet = async (req, res) => {
  const userId = req.body.userId;
  let checkPro = await PetrolCardWallet.find({ userId: userId });

  if (checkPro.length > 0) {
    let walletData = await PetrolCardWallet.find({ userId: userId }).sort({
      $natural: -1,
    });
    if (walletData) {
      res.json({ status: 200, result: walletData });
    } else {
      res.json({ status: 422, result: "Item not Found" });
    }
  } else {
    res.json({ status: 422, result: "Item not Exists" });
  }
};
