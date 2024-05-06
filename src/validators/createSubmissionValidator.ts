import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

import logger from "../config/loggerConfig";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ ...req.body });
      next();
    } catch (error) {
      if (error as ZodError) {
        logger.error(
          `Error Occured in validation ErrorType: ${(error as ZodError).name}, error: ${error}`,
        );
      }
      return res.status(400).json({
        result: false,
        message: "Invalid request params received",
        data: {},
        error: error,
      });
    }
  };
