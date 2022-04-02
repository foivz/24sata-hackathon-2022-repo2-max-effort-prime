import mongoose from "mongoose";
const { Schema } = mongoose;

export const ShoppingListTypes = {
  REGULAR: 1,
  WEEKLY: 2,
};

const shoppingListSchema = new Schema({
  type: Number,
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      quantity: Number,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Date,
  modifiedAt: Date,
});

shoppingListSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  this.modifiedAt = Date.now();
  next();
});

shoppingListSchema.statics.findByUserId = function (userId) {
  return this.where({ user: userId });
};

export default mongoose.model("ShoppingList", shoppingListSchema);
