import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  countryCode: {
    type: String,
    required: [false],
  },
  phone: {
    type: String,
    required: [false],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    required: [false],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
