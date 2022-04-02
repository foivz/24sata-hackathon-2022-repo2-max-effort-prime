import express from "express";
import { test } from "./controller.js";

const router = express.Router();

router.post("/user", test);

export default router;
