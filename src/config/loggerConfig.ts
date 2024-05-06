import "winston-mongodb";

import path from "node:path";

import winston from "winston";

import serverConfig from "./serverConfig";

const allowedTransports = [];

const winstonFormat = winston.format.combine(
  winston.format.colorize(),
  // First Argument to the combine method is defining how we want the timestamp to come up in log
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

  // Second Argument to the combine method, It defined In which format log is going to be printed.
  winston.format.printf(
    (log) => `${log.timestamp} [${log.level}]: ${log.message} \n`,
  ),
);

const winstonFormatDefault = winston.format.combine(
  // First Argument to the combine method is defining how we want the timestamp to come up in log
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

  // Second Argument to the combine method, It defined In which format log is going to be printed.
  winston.format.printf(
    (log) => `${log.timestamp} [${log.level.toUpperCase()}]: ${log.message}`,
  ),
);

// Configuration for the logging in the console
allowedTransports.push(
  new winston.transports.Console({
    format: winstonFormat,
  }),
);

allowedTransports.push(
  new winston.transports.File({
    level: "error",
    filename: path.join(__dirname, "..", "logs", "app.log"),
  }),
);

// Configuration for storing the log in the database
allowedTransports.push(
  new winston.transports.MongoDB({
    level: "error",
    db: serverConfig.MONGODB_LOGGER_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    collection: "logs",
  }),
);

// Configuring the winston object
const logger = winston.createLogger({
  format: winstonFormatDefault,
  transports: allowedTransports,
});

export default logger;
