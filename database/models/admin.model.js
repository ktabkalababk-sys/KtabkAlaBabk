import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    password: String,

    passwordChangedAt: Date,

    phoneNumber: String,
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
export const Admin = mongoose.model("Admin", schema);
