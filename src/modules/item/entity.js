import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String,
  price: Number,
  createdAt: Date,
  modifiedAt: Date,
});

itemSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  this.modifiedAt = Date.now();
  next();
});

export default mongoose.model("Item", itemSchema);
