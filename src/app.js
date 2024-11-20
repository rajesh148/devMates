const express = require("express");
const connectDB = require("./config/database");
const mongoSanitize = require("express-mongo-sanitize");

const cookieParser = require("cookie-parser");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

const PORT = 7777;

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());

app.use(cookieParser());

app.use(mongoSanitize());

app.use(helmet());

// Use Morgan in 'dev' mode
app.use(morgan("dev"));

const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

app.use(cors(corsOptions));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

connectDB()
  .then(() => {
    console.log("Database is connected susccessfully!!");

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database is not connected!!!", err);
    process.exit(1); // Exit the process with a failure code
  });
