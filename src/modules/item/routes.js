import express from "express";

import { createItem, getItemByQuery } from "./controller.js";

const itemRouter = express.Router();

itemRouter.post("/api/items", createItem);
itemRouter.get("/api/items", getItemByQuery);

export default itemRouter;
