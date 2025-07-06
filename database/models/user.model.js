import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    password: String,

    passwordChangedAt: Date,

    // city: String,

    // address: String,

    // phoneNumber: String,

    // secondPhoneNumber: String,

    // otp: String,

    // otpExp: Date,
  },
  { versionKey: false, timestamps: true }
);

schema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 8);
});

schema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 8);
});
export const User = mongoose.model("User", schema);
