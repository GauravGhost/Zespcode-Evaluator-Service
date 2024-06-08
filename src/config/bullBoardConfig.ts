import sampleQueue from "../queues/sampleQueue";
import submissionQueue from "../queues/submissionQueue";

const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/ui");

createBullBoard({
  queues: [new BullMQAdapter(sampleQueue), new BullMQAdapter(submissionQueue)],
  serverAdapter,
});

export default serverAdapter;
