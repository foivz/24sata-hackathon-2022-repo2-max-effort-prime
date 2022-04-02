import express from "express";

import { createGroup } from "./controller.js";

const groupRouter = express.Router();

groupRouter.post("/api/groups", createGroup);

export default groupRouter;
