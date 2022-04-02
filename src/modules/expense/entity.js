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
      price: Number,
    },
  ],
  amount: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  createdAt: Date,
  modifiedAt: Date,
});

expenseSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  this.modifiedAt = Date.now();
  this.amount = this.items.reduce(
    (currentTotal, item) => currentTotal + item.quantity * item.price,
    0
  );
  next();
});

expenseSchema.statics.findAllByUserId = function (userId) {
  return this.where({ user: userId });
};

expenseSchema.statics.findAllByGroupId = function (groupId) {
  return this.where({ group: groupId });
};

export default mongoose.model("Expense", expenseSchema);
