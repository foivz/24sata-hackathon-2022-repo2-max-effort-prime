import mongoose from "mongoose";
const { Schema } = mongoose;

const expenseSchema = new Schema({
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      quantity: Number,
      price: mongoose.Schema.Types.Decimal128,
    },
  ],
  amount: mongoose.Types.Decimal128,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Date,
  updatedAt: Date,
});

expenseSchema.pre("save", function (next) {
  this.amount = this.items.reduce(
    (currentTotal, item) => currentTotal + item.quantity * item.price,
    0
  );
  next();
});

expenseSchema.pre("updateOne", function (next) {
  this.updatedAt = Date.now();
  next();
});

expenseSchema.statics.findAllByUserId = function (userId) {
  return this.where({ user: userId });
};

export default mongoose.model("Expense", expenseSchema);
