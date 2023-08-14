const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  type: { type: String },
  categoryName: { type: String, default: "" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
});

module.exports = mongoose.model("category", categorySchema, "category");
