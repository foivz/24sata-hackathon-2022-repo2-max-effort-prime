import express from "express";

import { register, login } from "./controller.js";

const userRouter = express.Router();

userRouter.post("/api/users/register", register);
userRouter.post("/api/users/login", login);

export default userRouter;
