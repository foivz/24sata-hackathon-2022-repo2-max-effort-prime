import express from "express";
import { login } from "./controller.js";

const userRouter = express.Router();

userRouter.post("/api/users/login", login);

export default userRouter;
