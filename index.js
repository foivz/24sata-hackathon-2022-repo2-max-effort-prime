import mongoose from "mongoose";
import express from "express";

import userRouter from "./src/modules/user/routes.js";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://max-effort-prime:GXXMdfQRKXvEE9PP@cluster0.wizet.mongodb.net/24sata-hackathon?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to database"));

app.use(userRouter);

app.listen(PORT, () => console.log("Express server started"));
