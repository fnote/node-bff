/**
 * App routes index class
 *
 * @author: gkar5861 on 04/06/20
 * */
import express from "express";
import BatchRouter from "./routes/batch/batch";
import SupportRouter from "./routes/support/support";

const router = express.Router();

// add routes here
router.use("/batch", BatchRouter());

// Health check API
router.use("/support", SupportRouter());

export default router;
