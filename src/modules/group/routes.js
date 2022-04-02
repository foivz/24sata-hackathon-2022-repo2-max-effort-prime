import express from "express";

import {
  createGroup,
  updateGroupMemebers,
  fetchGroupsByUserId,
  fetchGroupMembers,
  fetchGroup,
} from "./controller.js";

const groupRouter = express.Router();

groupRouter.post("/api/groups", createGroup);
groupRouter.put("/api/groups/:groupId/members", updateGroupMemebers);
groupRouter.get("/api/users/:userId/groups", fetchGroupsByUserId);
groupRouter.get("/api/groups/:groupId/members", fetchGroupMembers);
groupRouter.get("/api/groups/:groupId", fetchGroup);

export default groupRouter;
