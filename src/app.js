const express = require("express");

const app = express();

// app.use("/user", (req, res) => {
//   res.send("hahahahahaha");
// });

app.get("/user", (req, res) => {
  res.send({ firstName: "Rajesh", lastName: "Bagguva" });
});

app.post("/user", async (req, res) => {
  console.log(req.body);
  //Save the data into DB first
  res.send("User data POST successfully");
});

app.delete("/user", (req, res) => {
  //Delete the data into DB first then do the send message
  res.send("User data delete successfully");
});

app.use("/test", (req, res) => {
  res.end("This is for /test");
});

app.listen("7777", () => {
  console.log("Server is running on 7777");
});
