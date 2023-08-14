const Product = require("../models/product.js");
const Category = require("../models/category.js");

const publicControllers = {
  getProducts: async (req, res) => {
    try {
      const limit = req.query.limit
      let products = {}
      if (limit) {
        products = await Product.find().limit(limit).populate("category")
      }
      else {
        products = await Product.find().populate("category")
      }
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getSingleProductByID: async (req, res) => {
    try {
      const id = req.params.id
      const products = await Product.findById(id).populate("category")
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find()
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = publicControllers;
