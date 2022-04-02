import express from "express";

import {
  createGroup,
  updateGroupMemebers,
  fetchGroupsByUserId,
} from "./controller.js";

const groupRouter = express.Router();

groupRouter.post("/api/groups", createGroup);
groupRouter.put("/api/groups/:groupId/members", updateGroupMemebers);
groupRouter.get("/api/users/:userId/groups", fetchGroupsByUserId);

export default groupRouter;
