const User = require("../models/user.js");
const Cart = require("../models/cart.js");
const user = require("../models/user.js");

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
};

module.exports = userControllers;
