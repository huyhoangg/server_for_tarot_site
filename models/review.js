const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  reviews: [
    {
      reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
      invoice: { type: mongoose.Schema.Types.ObjectId, ref: "invoice" },
      rating: { type: Number, default: 5 },
      content: { type: String, default: "" },
      reviewDay: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("review", reviewSchema);
