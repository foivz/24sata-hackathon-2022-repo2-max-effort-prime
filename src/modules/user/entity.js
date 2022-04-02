import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
});

export default mongoose.model("User", userSchema);
