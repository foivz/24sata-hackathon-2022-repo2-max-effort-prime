import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
  password: String,
});

export default mongoose.model("User", userSchema);
