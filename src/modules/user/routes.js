import express from "express";

import { register, login, updateUser } from "./controller.js";

const userRouter = express.Router();

userRouter.post("/api/users/register", register);
userRouter.post("/api/users/login", login);
userRouter.put("/api/users/:userId", updateUser);

export default userRouter;
