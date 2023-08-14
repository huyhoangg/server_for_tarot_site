const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cusId: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
  modifiedOn: { type: Date },
  products: [
    {
      _id: false,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  subTotal: { type: Number, default: 0 },
});

module.exports = mongoose.model("cart", cartSchema);
