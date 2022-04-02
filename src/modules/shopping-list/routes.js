import express from "express";

import { addItemToRegularList } from "./controller.js";

const shoppingListRoutes = express.Router();

shoppingListRoutes.post(
  "/api/users/:userId/shopping-list/regular",
  addItemToRegularList
);

export default shoppingListRoutes;
