import { Queue } from "bullmq";

import redisConnection from "../config/redisConfig";
import { EVALUATION_QUEUE } from "../utils/constants";

export default new Queue(EVALUATION_QUEUE, { connection: redisConnection });
