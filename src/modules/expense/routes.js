import express from "express";

import { createExpense } from "./controller.js";

const expenseRouter = express.Router();

expenseRouter.post("/api/users/:userId/expsenses", createExpense);

export default expenseRouter;
