import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String,
  price: mongoose.Types.Decimal128,
  createdAt: Date,
  updatedAt: Date,
});

itemSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  this.updatedAt = Date.now();
  next();
});

itemSchema.pre("updateOne", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Item", itemSchema);
