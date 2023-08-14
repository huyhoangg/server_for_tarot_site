const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, unique: true, default: "" },
  email: { type: String, unique: true, required: true, default: "" },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("account", userSchema);
