const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/userRoute.js");
const publicRoutes = require("./routes/publicRoute.js");

const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(cookieParser());
dotenv.config();

//Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/public", publicRoutes);


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.PORT, async () => {
      console.log(`server is running with port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
