const mongoose = require("mongoose");

const loyaltyProgramUserSchema = new mongoose.Schema({
  cusId: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
  points: { type: Number, default: 0 },
  history: [
    {
      _id: false,
      title: { type: String },
      point: { type: Number },
      date: { type: Date, default: Date.now() },
    },
  ],
  vouchers: [
    {
      voucherId: { type: mongoose.Schema.Types.ObjectId },
      code: { type: String },
    },
  ],
});

module.exports = mongoose.model(
  "loyaltyProgramUser",
  loyaltyProgramUserSchema,
  "loyaltyProgramUsers"
);
