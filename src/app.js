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

require("dotenv").config();

app.use(express.json());

app.use(cookieParser());

app.use(mongoSanitize());

app.use(helmet());

// Use Morgan in 'dev' mode
app.use(morgan("dev"));

// const corsOptions = {
//   origin: "http://localhost:5173", // Your frontend URL
//   credentials: true, // Allow cookies and credentials
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Explicitly allow PATCH
//   allowedHeaders: ["Content-Type", "Authorization"], // Include required headers
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   console.log("Request method:", req.method);
//   console.log("Request headers:", req.headers);
//   next();
// });

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Update to match your frontend origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  ); // Add PATCH explicitly
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true"); // For credentials
  if (req.method === "OPTIONS") {
    // Handle preflight requests
    return res.sendStatus(200);
  }
  next();
});

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Replace with your frontend URL
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS" // Add PATCH and OPTIONS here
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization" // Include headers as needed
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true); // Allow credentials
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200); // Handle preflight requests
//   }
//   next();
// });

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
