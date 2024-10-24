const express = require("express");
const upload = require("../common/multerConfig");
const { AdminLogin } = require("../controllers/AuthControllers");
const {
  getAllUsers,
  AllPointPrices,
  storePointPrices,
  updatePointPrices,
  deletePointPrices,
  updateUserDetails,
  adminWallet,
  acceptWithdrawRequest,
  acceptTopupRequest,
  getAdminWallet,
  addAdminWallet,
  getPackageRequest,
  acceptPackageRequest,
} = require("../controllers/AdminControllers");
const {
  getUserProfile,
  updateUserProfile,
  userWallet,
  allReferUsers,
  UserLogin,
  UserRegister,
  ReferUserRegister,
  WithdrawRequest,
  getLastRequest,
  TopUpRequest,
  getTopUpRequest,
  getWithdrawRequest,
  getAllTopUpRequest,
  buyPackageRequest,
  userCashbackWallet,
} = require("../controllers/UserControllers");
const router = express.Router();

// users Routes
router.post("/api/users/user-login", UserLogin);

router.post("/api/users/user-register", upload.single("image"), UserRegister);

router.post(
  "/api/users/refer-user-register",
  upload.single("image"),
  ReferUserRegister
);

router.post("/api/users/user-profile", getUserProfile);

router.post(
  "/api/users/update-users",
  upload.single("profile_image"),
  updateUserProfile
);

router.post("/api/users/users-wallet", userWallet);

router.post("/api/users/all-refer-users", allReferUsers);

router.post("/api/users/withdraw-request", WithdrawRequest);

router.post("/api/users/users-withdraw-request", getLastRequest);

router.post(
  "/api/users/topup-amount",
  upload.single("screenshot"),
  TopUpRequest
);

router.post("/api/users/users-topup-request", getTopUpRequest);

router.post(
  "/api/users/buy-package-request",
  upload.single("screenshot"),
  buyPackageRequest
);

router.post("/api/users/users-cashback-wallet", userCashbackWallet);

// Admin Routes
router.post("/api/admin/admin-login", AdminLogin);

router.get("/api/admin/all-users", getAllUsers);

router.get("/api/admin/all-point-prices", AllPointPrices);

router.post("/api/admin/add-point-prices", storePointPrices);

router.post("/api/admin/update-point-prices", updatePointPrices);

router.post("/api/admin/delete-point-prices", deletePointPrices);

router.post("/api/admin/add-card-details", updateUserDetails);

router.get("/api/admin/admin-wallet", adminWallet);

router.get("/api/admin/all-withdraw-request", getWithdrawRequest);

router.get("/api/admin/all-topup-request", getAllTopUpRequest);

router.post(
  "/api/admin/accept-withdraw-request",
  upload.single("screenshote"),
  acceptWithdrawRequest
);

router.post("/api/admin/accept-topup-request", acceptTopupRequest);

router.get("/api/admin/admin-wallet", getAdminWallet);

router.post("/api/admin/add-admin-wallet", addAdminWallet);

router.get("/api/admin/all-package-request", getPackageRequest);

router.post("/api/admin/accept-package-request", acceptPackageRequest);

module.exports = router;
