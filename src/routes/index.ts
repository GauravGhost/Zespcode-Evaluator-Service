import express from "express";

const router = express.Router();

import v1Router from "../routes/v1";

router.use("/v1", v1Router);

export default router;
