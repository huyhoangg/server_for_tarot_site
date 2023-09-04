const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const Invoice = require("../models/invoice.js");

const jwt = require("jsonwebtoken");

const adminControllers = {
  getIncomeByInterval: async (req, res) => {
    const interval = req.params.interval;

    let startDate = new Date();

    switch (interval) {
      case "week":
        if (startDate.getDay() === 0) {
          // If today is Sunday
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
      case "quarter":
        const currentMonth = startDate.getMonth();
        const monthsToSubtract = currentMonth % 3;
        startDate.setMonth(currentMonth - monthsToSubtract);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "year":
        startDate = new Date(startDate.getFullYear(), 0, 1); // Start of the year
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
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },
};

module.exports = adminControllers;
