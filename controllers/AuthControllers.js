const Admins = require("../modal/AdminsSchema");
// const Users = require("../modal/userSchema");

// exports.UserLogin = async (req, res) => {
//   const { username, password } = req.body;

//     const users = await Users.findOne({ "mobile": username });

//     if (users) {
//       if (users.password === password) {
//         const user = await Users.findOne({
//           _id: users._id,
//         }).select("-password");

//         res.json({
//           status: 200,
//           result: "User logged in successfully",
//           user:user,
//         });
//       } else {
//         res.json({ status: 422, result: "Invalid Credential! try again" });
//       }
//     } else {
//       res.json({ status: 422, result: "Invalid Credential! try again" });
//     }
// };

// exports.UserRegister = async (req, res) => {
//   let { name, mobile, email, address, password } = req.body;

//   const mobileExists = await Users.find({ "mobile": mobile });

//   if (mobileExists.length === 0) {
//     const user = new Users({
//       name,
//       email,
//       mobile,
//       address,
//       password,
//       stringPassword: password,
//       profile_image: req.file.filename,
//       cardStatus: "Pending",
//       status: "Active",
//       kycstatus: "Pending",
//     });
    
//     await user.save();
//     res.json({
//       status: 200,
//       result: "User created successfully",
//     });
//   } else {
//     res.json({
//       status: 422,
//       result: "User already exists! Use other mobile number",
//     });
//   }
// };

exports.AdminLogin = async (req, res) => {
  let username = req.body.username;
  let hash = req.body.password;

  const admins = await Admins.findOne({ email: username });

  if (admins !== null || admins !== "") {
    if (admins.password === hash) {
      res.json({
        status: 200,
        result: "Admin logged in successfully",
        admins,
      });
    } else {
      res.json({ status: 422, message: "Invalid Credential! try again" });
    }
  } else {
    res.json({ status: 422, message: "User not found" });
  }
};