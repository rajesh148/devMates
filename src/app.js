const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.end("This is for /test");
});

app.use("/hello", (req, res) => {
  res.end("This is for /hello");
});

app.listen("7777", () => {
  console.log("Server is running on 7777");
});
