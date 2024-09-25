const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [4, "First Name Length should be more than 3"],
      maxLength: [50, "First Name Length should be less than 50"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [4, "Last Name Length should be more than 3"],
      maxLength: [50, "Last Name Length should be less than 50"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [4, "Password Length should be more than 3"],
      maxLength: [50, "Password Length should be less than 50"],
    },
    age: {
      type: Number,
      min: [18, "You must be at least 18 years old!"], // Optional with validation
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, 'User phone number required'],
      validate: {
        validator: function(v) {
          // Custom validation: Phone number should start with 6-9 and be 10 digits long
          return /^[6-9]\d{9}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! It must be a 10-digit number starting with 6-9.`
      }
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
