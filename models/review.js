const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
  rating: { type: Number, default: 5 },
  comment: { type: String, default: "" },
  reviewDay: { type: Date},
});

module.exports = mongoose.model("review", reviewSchema);
