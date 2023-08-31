const User = require("../models/user.js");
const Cart = require("../models/cart.js");
const Invoice = require("../models/invoice.js");
const Review = require("../models/review.js");

const moment = require("moment");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const userControllers = {
  profileUser: async (req, res) => {
    try {
      const user = req.user;
      const userData = await User.findById(user.id);
      const { password, admin, ...others } = userData._doc;
      res.status(200).json({ ...others });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateProfileUser: async (req, res) => {
    try {
      const userid = req.user.id;
      const userData = await User.findOneAndUpdate(
        { _id: userid },
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
        }
      );
      res.status(200).json({ userData });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  addToCart: async (req, res) => {
    try {
      const { productId } = req.body;
      const userID = req.user.id;

      const userCart = await Cart.findOne({
        cusId: userID,
        "products.productId": productId,
      });

      if (userCart) {
        await Cart.findOneAndUpdate(
          { cusId: userID, "products.productId": productId },
          { $inc: { "products.$.quantity": 1 } }
          // { new: true }
        );
      } else {
        await Cart.findOneAndUpdate(
          { cusId: userID },
          {
            $set: { cusId: userID },
            $push: { products: { productId: productId, quantity: 1 } },
          },
          { upsert: true }
        );
      }

      res.status(200).send("Product added to cart successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.body;
      const userID = req.user.id;

      const userCart = await Cart.findOne({
        cusId: userID,
        "products.productId": productId,
      });

      if (!userCart) {
        return res.status(200).send("not found product in cart");
      }

      const productToChange = userCart.products.filter(
        (p) => p.productId == productId
      );

      if (productToChange[0].quantity > 1) {
        await Cart.findOneAndUpdate(
          { cusId: userID, "products.productId": productId },
          { $inc: { "products.$.quantity": -1 } }
        );
      } else {
        await Cart.findOneAndUpdate(
          { cusId: userID },
          {
            $pull: { products: { productId: productId, quantity: 1 } },
          }
        );
      }

      res.status(200).send("remove by one successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  removeAllCart: async (req, res) => {
    try {
      const { productId } = req.body;
      const userID = req.user.id;

      const userCart = await Cart.findOne({
        cusId: userID,
        "products.productId": productId,
      });

      if (!userCart) {
        return res.status(200).send("not found product in cart");
      }

      await Cart.findOneAndUpdate(
        { cusId: userID },
        {
          $pull: { products: { productId: productId } },
        }
      );

      res.status(200).send("remove all item successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserCart: async (req, res) => {
    try {
      const userID = req.user.id;

      const userCart = await Cart.findOne({
        cusId: userID,
      }).populate("products.productId");

      if (!userCart) {
        const newCart = await Cart.findOneAndUpdate(
          { cusId: userID },
          {
            $set: { cusId: userID },
            $push: { products: [] },
          },
          { upsert: true },
          { new: true }
        );
        return res.status(200).send([]);
      }

      const formatCart = userCart.products.map((product, index) => ({
        productId: product.productId._id,
        productDetail: product.productId,
        quantity: product.quantity,
      }));

      res.status(200).send(formatCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  userPayment: async (req, res) => {
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    // var dateFormat = require("dateformat");

    var tmnCode = process.env.VNP_TMN_CODE;
    var secretKey = process.env.VNP_HASH_SECRET;
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    var returnUrl = "http://localhost:5173/thanks";

    var date = new Date();

    var createDate = moment(date).format("YYYYMMDDHHmmss");
    var orderId = req.body.orderId;
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;

    // var orderInfo = req.body.orderDescription;
    // var orderType = req.body.orderType;
    var locale = req.body.language;
    if (locale === null || locale === "" || locale === undefined) {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "thanh toan hoa don";
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "" && bankCode !== undefined) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    // const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    // res.redirect(vnpUrl);
    res.json({ redirectUrl: vnpUrl, vnp_Params });
  },
  createInvoice: async (req, res) => {
    try {
      const userID = req.user.id;

      const userCart = await Cart.findOne({
        cusId: userID,
      });

      const { products } = userCart;

      // const formatProduct = products.map(product=>({...product, isReviewed: false}))

      const newInvoice = new Invoice({
        cusId: userID,
        pointReceived: 100,
        total: req.body.amount,
        paymentInfo: {
          _id: false,
          vnp_Amount: req.body.vnp_Amount,
          vnp_BankCode: req.body.vnp_BankCode,
          vnp_BankTranNo: req.body.vnp_BankTranNo,
          vnp_CardType: req.body.vnp_CardType,
          vnp_OrderInfo: req.body.vnp_OrderInfo,
          vnp_OrderId: req.body.vnp_OrderId,
        },
        products,
      });

      const saveInvoice = await newInvoice.save();
      res.status(200).send(saveInvoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  checkInvoice: async (req, res) => {
    try {
      let vnp_Params = req.query;
      let secureHash = vnp_Params["vnp_SecureHash"];

      let orderId = vnp_Params["vnp_TxnRef"];
      let rspCode = vnp_Params["vnp_ResponseCode"];
      let amount = vnp_Params["vnp_Amount"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);
      let secretKey = process.env.VNP_HASH_SECRET;
      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      // let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      let paymentStatus = "pending"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
      //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
      //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

      const orderInfo = await Invoice.findById(orderId);
      let checkOrderId = orderId == orderInfo?._id; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
      let checkAmount = Number(amount) / 100 === orderInfo?.total; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
      if (secureHash === signed) {
        //kiểm tra checksum
        if (checkOrderId) {
          if (checkAmount) {
            if (paymentStatus == "pending") {
              //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
              if (rspCode == "00") {
                //thanh cong
                paymentStatus = "paid";
                await orderInfo.updateOne(
                  { paymentInfo: vnp_Params, status: paymentStatus },
                  {
                    new: true,
                    upsert: true,
                  }
                );
                await Cart.findOneAndDelete({ cusId: orderInfo.cusId });
                res
                  .status(200)
                  .json({ RspCode: "00", Message: "Success", orderId });
              } else {
                //that bai
                paymentStatus = "failed";
                await orderInfo.updateOne(
                  { paymentInfo: vnp_Params, status: paymentStatus },
                  {
                    new: true,
                    upsert: true,
                  }
                );
                res
                  .status(200)
                  .json({ RspCode: rspCode, Message: "fail payment" });
              }
            } else {
              res.status(200).json({
                RspCode: "02",
                Message: "This order has been updated to the payment status",
              });
            }
          } else {
            res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
          }
        } else {
          res.status(200).json({ RspCode: "01", Message: "Order not found" });
        }
      } else {
        res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  },
  getInvoice: async (req, res) => {
    try {
      const userID = req.user.id;
      const orderId = req.params.orderId;
      const invoice = await Invoice.findById(orderId).populate(
        "products.productId",
        ["imageURLs", "name", "describe", "price"]
      );
      if (!invoice) {
        return res.status(200).json("Not exist this invoice");
      }
      if (invoice.cusId != userID) {
        return res.status(200).json("None of permission");
      }
      res.status(200).json(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getInvoices: async (req, res) => {
    try {
      const userID = req.user.id;
      const orderId = req.params.orderId;
      const invoices = await Invoice.find({ cusId: userID }).populate(
        "products.productId",
        ["price"]
      );

      res.status(200).json(invoices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  postReview: async (req, res) => {
    try {
      const userID = req.user.id;
      const orderID = req.body.orderID;
      const productID = req.body.productID;
      const content = req.body.content;
      const rating = req.body.rating;

      const check = await Invoice.findOne({
        _id: orderID,
        "products.productId": productID,
      });

      if (!check) {
        return res.status(200).json("only review after bought product");
      }

      const reviewExist = await Review.findOne({
        product: productID,
      });

      if (reviewExist) {
        await Review.findOneAndUpdate(
          { product: productID },
          {
            $push: {
              reviews: {
                reviewer: userID,
                invoice: orderID,
                rating,
                content,
              },
            },
          }
        );
      } else {
        const newReview = new Review({
          product: productID,
          reviews: [
            {
              reviewer: userID,
              invoice: orderID,
              rating,
              content,
            },
          ],
        });
        const saveNewReview = await newReview.save();
      }
      await Invoice.findOneAndUpdate(
        {
          _id: orderID,
          "products.productId": productID,
        },
        {
          $set: {
            "products.$.isReview": true,
          },
        }
      );
      res.status(200).json(reviewExist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getReview: async (req, res) => {
    try {
      const userID = req.user.id;
      const orderID = req.query["orderID"];
      const productID = req.query["productID"];

      if (!orderID || !productID || !userID) {
        return res.status(200).json("not enough information to get data");
      }

      const check = await Review.findOne({
        product: productID,
        "reviews.invoice": orderID,
        "reviews.reviewer": userID,
      });

      if (!check) {
        return res.status(200).json("you not bought this product");
      }

      const { reviews } = check;
      const { content, rating } = reviews[0];

      res.status(200).json({ content, rating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  
};

module.exports = userControllers;
