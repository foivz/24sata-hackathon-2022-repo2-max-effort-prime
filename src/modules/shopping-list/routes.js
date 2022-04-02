import express from "express";

import {
  addItemToRegularList,
  deleteRegularShoppingListItem,
} from "./controller.js";

const shoppingListRoutes = express.Router();

shoppingListRoutes.post(
  "/api/users/:userId/shopping-list/regular",
  addItemToRegularList
);
shoppingListRoutes.delete(
  "/api/users/:userId/shopping-list/regular/items/:itemId",
  deleteRegularShoppingListItem
);

export default shoppingListRoutes;
