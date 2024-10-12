const express = require("express");
const connectDB = require("./config/database");
const mongoSanitize = require("express-mongo-sanitize");

const cookieParser = require("cookie-parser");

const app = express();

const PORT = 7777;

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json());

app.use(cookieParser());

app.use(mongoSanitize());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Database is connected susccessfully!!");

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database is not connected!!!");
  });
