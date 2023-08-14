const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const authControllers = {
  registerUser: async (req, res) => {
    try {
      const checkUsername = await User.findOne({ username: req.body.username });
      if (checkUsername) {
        return res.status(404).json("username existed");
      }

      const checkEmail = await User.findOne({ email: req.body.email });
      if (checkEmail) {
        return res.status(404).json("email existed");
      }

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        password: hashed,
        email: req.body.email,
        firstName: req.body.firstName,
      });

      const user = await newUser.save();
      res.status(200).json(user.email);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json("invalid email");
      }
      const password_validate = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!password_validate) {
        return res.status(404).json("invalid password");
      }

      const token = jwt.sign(
        { id: user._id, admin: user.admin },
        process.env.JWT_SECRET_KEY
      );

      const { password, admin, ...other } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .status(200)
        .json({ ...other });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  logOutUser: async (req, res) => {
    res.cookie("access_token", "none", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      expires: new Date(Date.now() + 2 * 1000),
    });
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  },
};

module.exports = authControllers;
