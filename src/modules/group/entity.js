import mongoose from "mongoose";
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: String,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  monthlyBudget: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: Date,
  modifiedAt: Date,
});

groupSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  this.modifiedAt = Date.now();
  next();
});

export default mongoose.model("Group", groupSchema);
