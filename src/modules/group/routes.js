import express from "express";

import {
  createGroup,
  updateGroupMemebers,
  fetchGroupsByUserId,
  fetchGroupMembers,
  deleteGroupMemeber,
  fetchGroup,
  updateGroup,
} from "./controller.js";

const groupRouter = express.Router();

groupRouter.post("/api/groups", createGroup);
groupRouter.put("/api/groups/:groupId/members", updateGroupMemebers);
groupRouter.get("/api/users/:userId/groups", fetchGroupsByUserId);
groupRouter.get("/api/groups/:groupId/members", fetchGroupMembers);
groupRouter.delete(
  "/api/groups/:groupId/members/:memberId",
  deleteGroupMemeber
);
groupRouter.get("/api/groups/:groupId", fetchGroup);
groupRouter.put("/api/groups/:groupId", updateGroup);

export default groupRouter;
