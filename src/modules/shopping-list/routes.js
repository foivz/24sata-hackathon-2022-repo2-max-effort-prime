import express from "express";

import {
  addItemToRegularList,
  deleteRegularShoppingListItem,
  fetchRegularShoppingListByUserId,
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
shoppingListRoutes.get(
  "/api/users/:userId/shopping-list/regular",
  fetchRegularShoppingListByUserId
);

export default shoppingListRoutes;
