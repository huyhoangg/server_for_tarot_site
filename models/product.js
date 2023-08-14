const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String },
  author: { type: String },
  producer: { type: String },
  stock: { type: Number },
  sold: { type: Number },
  ibsn: { type: String },
  price: { type: Number, default: 0 },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "review" }],
  describe: { type: String },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "category" }],
  include: { type: String },
  imageURLs: [{ type: String }],
});

module.exports = mongoose.model("product", productSchema);
