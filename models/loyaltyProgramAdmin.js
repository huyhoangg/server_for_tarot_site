const mongoose = require("mongoose");

const loyaltyProgramSchema = new mongoose.Schema({
  pointReview: { type: Number },
  pointPaid: { type: Number },
  vouchers: [
    {
      title: { type: String },
      value: { type: Number },
      points: { type: Number },
      image: { type: String },
    },
  ],
  reward: {
    expired: { type: Date },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    point: { type: Number },
  },
});

module.exports = mongoose.model(
  "loyaltyProgramAdmin",
  loyaltyProgramSchema,
  "loyaltyProgramAdmins"
);
