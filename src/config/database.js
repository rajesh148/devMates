const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://rajeshbagguvaiiitn:rajeshbagguva@namastenode.jbybb.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
