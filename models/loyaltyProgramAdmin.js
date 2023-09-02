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
});

module.exports = mongoose.model(
  "loyaltyProgramAdmin",
  loyaltyProgramSchema,
  "loyaltyProgramAdmins"
);
