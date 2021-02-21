const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // validator: (value) => {
      //   if (!validator.isEmail(value)) {
      //     throw new Error({ error: "Email is incorrect" });
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      min: 7,
      max: 30,
    },
    subjects: {
      type: Array,
    },
    token: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
