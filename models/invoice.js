const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  cusId: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
  dueDate: { type: Date, default: Date.now },
  pointReceived: { type: Number },
  shippingCharges: { type: Number },
  total: { type: Number },
  paymentInfo: {
    _id: false,
    vnp_Amount: { type: Number },
    vnp_BankCode: { type: String },
    vnp_BankTranNo: { type: String },
    vnp_CardType: { type: String },
    vnp_OrderInfo: { type: String },
  },
  products: [
    {
      _id: false,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: { type: Number, default: 1 },
      isReview: { type: Boolean, default: false },
    },
  ],
  status: { type: String, default: "pending" },
  promo: { type: mongoose.Schema.Types.ObjectId },
  loyalty: { type: Boolean, default: false },
});

module.exports = mongoose.model("invoice", invoiceSchema);
