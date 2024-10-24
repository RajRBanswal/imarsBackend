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
        profile_image: req.file.filename,
        cardStatus: "Pending",
        status: "Active",
        kycstatus: "Pending",
        sponsorId: referenceId || null,
      });
  
  
      const sponsorLevel1 = await Users.findById(referenceId);
  
      const updateWallet = async (
        points,
        userId,
        userName,
        userMobile,
        level
      ) => {
        let userNames = userName;
        let userMobiles = userMobile;
  
        const userData = await Users.findById(userId);
  
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
          reason: `Refer & Earn Level ${level}`,
          transactionDate: date,
          transactionTime: time,
          transactionId: transactionId,
          amountStatus: "Done",
        });
        await UserWallet.create({
          orderId: "",
          adminId: "",
          adminName: "",
          amount: points.price,
          userId: userId,
          userName: userData.name,
          userMobile: userData.mobile,
          openingBalance: "",
          type: "Credit",
          status: "Success",
          reason: `Refer & Earn Level ${level}`,
          paymode: "",
          utrNo: "",
          transactionDate: date,
          transactionTime: time,
          transactionId: transactionId,
        });
      };
  
      const findReferPoints = async (level) => {
        const points = await PointsManagament.find({ type: "Refer Earn", level })
          .sort({ $natural: -1 })
          .limit(1);
        return points[0];
      };
  
      if (!sponsorLevel1.level1) {
        user.level1 = sponsorLevel1._id;
        const referPoints = await findReferPoints("1");
        await updateWallet(
          referPoints,
          referenceId,
          referenceName,
          referenceMobile,
          1
        );
      } else if (!sponsorLevel1.level2) {
        user.level2 = sponsorLevel1._id;
        user.level1 = sponsorLevel1.level1;
        const referPoints1 = await findReferPoints("1");
        await updateWallet(
          referPoints1,
          referenceId,
          referenceName,
          referenceMobile,
          1
        );
  
        const referPoints2 = await findReferPoints("2");
        await updateWallet(
          referPoints2,
          sponsorLevel1.level1,
          "level2",
          "level2",
          2
        );
      } else if (!sponsorLevel1.level3) {
        user.level3 = sponsorLevel1._id;
        user.level2 = sponsorLevel1.level2;
        user.level1 = sponsorLevel1.level1;
        const referPoints1 = await findReferPoints("1");
        await updateWallet(
          referPoints1,
          referenceId,
          referenceName,
          referenceMobile,
          1
        );
  
        const referPoints2 = await findReferPoints("2");
        await updateWallet(
          referPoints2,
          sponsorLevel1.level2,
          "level2",
          "level2",
          2
        );
  
        const referPoints3 = await findReferPoints("3");
        await updateWallet(
          referPoints3,
          sponsorLevel1.level1,
          "level3",
          "level3",
          3
        );
      } else if (!sponsorLevel1.level4) {
        user.level4 = sponsorLevel1._id;
        user.level3 = sponsorLevel1.level3;
        user.level2 = sponsorLevel1.level2;
        user.level1 = sponsorLevel1.level1;
        const referPoints1 = await findReferPoints("1");
        await updateWallet(
          referPoints1,
          referenceId,
          referenceName,
          referenceMobile,
          1
        );
  
        const referPoints2 = await findReferPoints("2");
        await updateWallet(
          referPoints2,
          sponsorLevel1.level3,
          "level2",
          "level2",
          2
        );
  
        const referPoints3 = await findReferPoints("3");
        await updateWallet(
          referPoints3,
          sponsorLevel1.level2,
          "level3",
          "level3",
          3
        );
  
        const referPoints4 = await findReferPoints("4");
        await updateWallet(
          referPoints4,
          sponsorLevel1.level1,
          "level4",
          "level4",
          4
        );
      } else if (!sponsorLevel1.level5) {
        user.level5 = sponsorLevel1._id;
        user.level4 = sponsorLevel1.level4;
        user.level3 = sponsorLevel1.level3;
        user.level2 = sponsorLevel1.level2;
        user.level1 = sponsorLevel1.level1;
        const referPoints1 = await findReferPoints("1");
        await updateWallet(
          referPoints1,
          referenceId,
          referenceName,
          referenceMobile,
          1
        );
  
        const referPoints2 = await findReferPoints("2");
        await updateWallet(
          referPoints2,
          sponsorLevel1.level4,
          "level2",
          "level2",
          2
        );
  
        const referPoints3 = await findReferPoints("3");
        await updateWallet(
          referPoints3,
          sponsorLevel1.level3,
          "level3",
          "level3",
          3
        );
  
        const referPoints4 = await findReferPoints("4");
        await updateWallet(
          referPoints4,
          sponsorLevel1.level2,
          "level2",
          "level2",
          4
        );
  
        const referPoints5 = await findReferPoints("5");
        await updateWallet(
          referPoints5,
          sponsorLevel1.level1,
          "level1",
          "level1",
          5
        );
      } else {
        user.level5 = sponsorLevel1._id;
        user.level4 = sponsorLevel1.level5;
        user.level3 = sponsorLevel1.level4;
        user.level2 = sponsorLevel1.level3;
        user.level1 = sponsorLevel1.level2;
        const referPoints1 = await findReferPoints("1");
        await updateWallet(
          referPoints1,
          referenceId,
          referenceName,
          referenceMobile,
          1
        );
  
        const referPoints2 = await findReferPoints("2");
        await updateWallet(
          referPoints2,
          sponsorLevel1.level5,
          "level2",
          "level2",
          2
        );
  
        const referPoints3 = await findReferPoints("3");
        await updateWallet(
          referPoints3,
          sponsorLevel1.level4,
          "level3",
          "level3",
          3
        );
  
        const referPoints4 = await findReferPoints("4");
        await updateWallet(
          referPoints4,
          sponsorLevel1.level3,
          "level2",
          "level2",
          4
        );
  
        const referPoints5 = await findReferPoints("5");
        await updateWallet(
          referPoints5,
          sponsorLevel1.level2,
          "level1",
          "level1",
          5
        );
      }
  
      // Save the admin and user wallet amounts after the referral points are assigned
  
      // Save the new user
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