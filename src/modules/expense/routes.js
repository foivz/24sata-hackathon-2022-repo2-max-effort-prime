import express from "express";

import {
  createExpense,
  fetchExpensesByUserId,
  fetchExpenseItemsByExpenseId,
  assignExpenseToGroup,
  addItemToExpense,
} from "./controller.js";

const expenseRouter = express.Router();

expenseRouter.post("/api/users/:userId/expenses", createExpense);
expenseRouter.get("/api/users/:userId/expenses", fetchExpensesByUserId);
expenseRouter.get(
  "/api/expenses/:expenseId/items",
  fetchExpenseItemsByExpenseId
);
expenseRouter.put("/api/expenses/:expenseId/items", addItemToExpense);
expenseRouter.put(
  "/api/expenses/:expenseId/groups/:groupId",
  assignExpenseToGroup
);

export default expenseRouter;
