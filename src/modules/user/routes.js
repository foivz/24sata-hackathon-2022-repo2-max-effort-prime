import express from "express";

import {
  register,
  login,
  updateUser,
  fetchAllUsers,
  fetchUserById,
  fetchDashboardDataByUserId,
} from "./controller.js";

const userRouter = express.Router();

userRouter.post("/api/users/register", register);
userRouter.post("/api/users/login", login);
userRouter.put("/api/users/:userId", updateUser);
userRouter.get("/api/users", fetchAllUsers);
userRouter.get("/api/users/:userId", fetchUserById);
userRouter.get("/api/users/:userId/dashboard", fetchDashboardDataByUserId);

export default userRouter;
