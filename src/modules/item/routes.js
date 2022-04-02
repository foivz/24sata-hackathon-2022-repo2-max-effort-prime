import express from "express";

import { createItem } from "./controller.js";

const itemRouter = express.Router();

itemRouter.post("/api/items", createItem);

export default itemRouter;
