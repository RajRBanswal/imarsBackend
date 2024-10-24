const mongoose = require("mongoose");

const AdminsSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        mobile: String,
        password: String,
    },
    { timestamps: true }
);

const Admins = mongoose.model("admins", AdminsSchema);
module.exports = Admins;

