import { Schema } from "mongoose";

const User = new Schema({
  email: String,
  password: String,
});

export default User;
