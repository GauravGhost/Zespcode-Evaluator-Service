import express from "express";

import { pingCheck } from "../../controllers/pingController";
import submissionRouter from "./submissionRoutes";

const router = express.Router();

router.use("/submissions", submissionRouter);
router.get("/ping", pingCheck);

export default router;
