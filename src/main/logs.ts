import { createLogger, transports, format, Logger } from "winston";
import "winston-daily-rotate-file";
import { resolve } from "path";
import { getTempPath } from "./utils";

const { combine, timestamp, json } = format;

export let debugLogger: Logger;

export const createDebugLogger = () => {
  if (debugLogger) return
  const transport = new transports.DailyRotateFile({
    filename: `debug-%DATE%.log`,
    dirname: resolve(getTempPath(), "logs", "debug"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: false,
    maxSize: "10m",
    maxFiles: "14d",
    json: true,
  });

  const logger = createLogger({
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      json()
    ),
    transports: [
      transport,
    ],
  });
  debugLogger = logger;
};
