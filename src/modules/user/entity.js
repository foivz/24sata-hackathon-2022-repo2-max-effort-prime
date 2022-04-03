import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: String,
  monthlyBudget: { type: Number, default: 0 },
  createdAt: Date,
  modifiedAt: Date,
});

userSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  this.modifiedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
