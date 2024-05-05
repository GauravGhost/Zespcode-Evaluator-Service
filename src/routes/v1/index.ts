import express from "express";

import { pingCheck } from "../../controllers/pingController";

const router = express.Router();

router.get("/ping", pingCheck);

export default router;
