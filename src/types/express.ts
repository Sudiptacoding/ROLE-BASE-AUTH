// src/types/express.d.ts
import { User } from "@prisma/client"; // Assuming User is a Prisma model; adjust as needed
import "express";

declare global {
  namespace Express {
    export interface Request {
      user?: User; // Add optional user property to the Request interface
    }
  }
}
