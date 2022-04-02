import express from "express";

import { createExpense, fetchExpensesByUserId } from "./controller.js";

const expenseRouter = express.Router();

expenseRouter.post("/api/users/:userId/expsenses", createExpense);
expenseRouter.get("/api/users/:userId/expsenses", fetchExpensesByUserId);

export default expenseRouter;
