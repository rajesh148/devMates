const express = require("express");

const app = express();

const { authMiddleware, userMiddleware } = require("./middlewares/middlewares");

// app.use("/user", (req, res) => {
//   res.send("hahahahahaha");
// });

app.use("/admin", authMiddleware);

app.get("/user", userMiddleware, (req, res) => {
  res.send({ firstName: "Rajesh", lastName: "Bagguva" });
});

app.get("/admin/:id", (req, res) => {
  res.send("Admin usrer id");
});

app.post("/admin/createData", (req, res) => {
  res.send("Data created!!!!");
});

app.listen("7777", () => {
  console.log("Server is running on 7777");
});
