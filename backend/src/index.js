import mongoose from "mongoose";
import express from "express";
import router from "./modules/user/routes.js";

const app = express();

mongoose
  .connect("mongodb+srv://max-effort-prime:GXXMdfQRKXvEE9PP@cluster0.wizet.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
  .then(() => console.log("Connected to database"));

app.use(router);

app.listen(3000, () => console.log("Express server started"));
