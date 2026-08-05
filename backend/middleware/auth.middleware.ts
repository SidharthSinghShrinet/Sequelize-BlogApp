import express from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.utils";
import { jwtVerify } from "jose";
import users from "../model/user.model";
import type { Model } from "sequelize";

//@ Extend the Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: Model | null; // The authenticated user object, if available
    }
  }
}

const authenticate = expressAsyncHandler(async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  const token = req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    throw new ErrorHandler("Unauthorized, Please log in!", 401);
  }
  const decodedToken = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!),
  );
  if (!decodedToken) {
    throw new ErrorHandler("Invalid token, Please log in again!", 401);
  }
  const userId = decodedToken?.payload?.id as number;
  const user = await users.findByPk(userId);

  if (!user) {
    throw new ErrorHandler("User not foundS!", 404);
  }

  req.user = user; // Attach the user object to the request for downstream use
  next();
});

export const optionalAuthenticate = expressAsyncHandler(async (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    const token = req?.cookies?.token || req?.headers?.authorization?.split(" ")[1];
    if (token) {
      const decodedToken = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!),
      );
      if (decodedToken?.payload?.id) {
        const userId = decodedToken.payload.id as number;
        const user = await users.findByPk(userId);
        if (user) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Silently continue for optional auth
  }
  next();
});

export default authenticate;
