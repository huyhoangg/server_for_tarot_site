const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const Invoice = require("../models/invoice.js");
const Product = require("../models/product.js");
const Category = require("../models/category.js");

const jwt = require("jsonwebtoken");
const user = require("../models/user.js");

const adminControllers = {
  getIncomeByInterval: async (req, res) => {
    const interval = req.params.interval;

    let startDate = new Date();

    switch (interval) {
      case "week":
        if (startDate.getDay() === 0) {
          startDate.setDate(startDate.getDate() - 6);
        } else {
          startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        }
        startDate.setUTCHours(0, 0, 0);
        break;
      case "month":
        startDate.setDate(1);
        startDate.setUTCHours(0, 0, 0);
        break;
      case "year":
        startDate = new Date(startDate.getFullYear(), 0, 1);
        startDate = new Date(
          Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          )
        );
        break;
      default:
        return res.status(400).json({ error: "Invalid interval" });
    }

    try {
      const invoice = await Invoice.find(
        {
          dueDate: {
            $gte: startDate,
          },
        },
        { total: 1, dueDate: 1, _id: 0 }
      );
      function getCurrentWeekDates() {
        const start = startDate;
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { start, end };
      }

      const groupedByDate = invoice.reduce((acc, curr) => {
        const date = new Date(curr.dueDate).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + curr.total;
        return acc;
      }, {});

      let result = [];

      if (interval == "week") {
        const { start, end } = getCurrentWeekDates();

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split("T")[0];
          result.push({
            date: dateString,
            total: groupedByDate[dateString] || 0,
          });
        }
      } else if (interval == "month") {
        const now = new Date();
        const lastDay = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)
        );
        lastDay.setDate(lastDay.getUTCDate() + 1);
        for (let d = startDate; d <= lastDay; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split("T")[0];
          result.push({
            date: dateString,
            total: groupedByDate[dateString] || 0,
          });
        }
      } else if (interval == "year") {
        const totalAccumulate = invoice.reduce(
          (acc, curr) => acc + curr.total,
          0
        );

        result = { total: totalAccumulate };
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  getTotalPaidOrder: async (req, res) => {
    try {
      const total_invoice = await Invoice.find({
        status: "paid",
      }).count();
      res.json({ total: total_invoice });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  getTotalUser: async (req, res) => {
    try {
      const total_user = await User.find({}).count();
      res.json({ total: total_user });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  getAllUser: async (req, res) => {
    try {
      const users = await User.find({});
      const invoice = await Invoice.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: "$cusId",
            totalPay: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
      ]);

      const format_users = users.map((user) => {
        const found = invoice.find(
          (inv) => inv._id.toString() === user._id.toString()
        );
        if (found) {
          return {
            ...user._doc,
            totalPay: found.totalPay,
            totalOrder: found.count,
          };
        }
        return user;
      });

      res.json(format_users);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({}).populate("category", [
        "categoryName",
        "_id",
      ]);

      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const type = req.params.type;

      if (type != "all") {
        const cat = await Category.find({ type }).select("categoryName _id");
        return res.status(200).json(cat);
      } else {
        const cat = await Category.find({}).select("categoryName _id type");
        return res.status(200).json(cat);
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const catId = req.body.catInfo._id;

      const cat = await Category.findByIdAndUpdate(catId, {
        type: req.body.catInfo.type,
        categoryName: req.body.catInfo.categoryName,
      });
      return res.status(200).json("updated");
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const catId = req.params.catId;

      const catdel = await Category.findByIdAndDelete(catId);

      res.status(200).send("deleted");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  addCategory: async (req, res) => {
    try {
      const newCat = new Category({
        type: req.body.catInfo.type,
        categoryName: req.body.catInfo.categoryName,
        products: [],
      });

      const saveProduct = await newCat.save();
      res.status(200).send("created");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const productInfo = req.body.productInfo;

      const { name, describe, type, author, _id, imageURLs, category } =
        productInfo;

      const product = await Product.findByIdAndUpdate(_id, {
        name,
        describe,
        type,
        author,
        category,
        imageURLs,
      });

      return res.status(200).json("updated");
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  addProduct: async (req, res) => {
    try {
      const newProduct = new Product({
        include: req.body.productInfo.include,
        ibsn: req.body.productInfo.ibsn,
        type: req.body.productInfo.type,
        author: req.body.productInfo.author,
        producer: req.body.productInfo.producer,
        stock: 1,
        sold: 0,
        price: req.body.productInfo.price,
        describe: req.body.productInfo.describe,
        category: req.body.productInfo.category,
        imageURLs: req.body.productInfo.imageURLs,
        name: req.body.productInfo.name,
      });

      const saveProduct = await newProduct.save();
      res.status(200).send("updated");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findByIdAndDelete(productId);

      res.status(200).send("deleted");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllUpcomingOrders: async (req, res) => {
    try {
      const total_invoice = await Invoice.find({
        status: "paid",
        delivery: false,
      })
        .populate("cusId", ["firstName", "lastName", "address", "phone"])
        .populate("products.productId", ["name", "_id", "price"]);
      res.json(total_invoice);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
  setDelivery: async (req, res) => {
    const productId = req.params.productId;
    try {
      await Invoice.findByIdAndUpdate(productId, {
        delivery: true,
      });
      res.json("delivery ok");
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
};

module.exports = adminControllers;
