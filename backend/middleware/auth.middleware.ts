import express from "express";
import ErrorHandler from "../utils/errorHandler.utils";
import { jwtVerify } from "jose";
import users from "../model/user.model";
import type { Model } from "sequelize";
import expressAsyncHandler from "express-async-handler";

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
  const token = req.cookies.token || req.headers["cookie"]?.split("=")[1];
  if (!token) {
    throw new ErrorHandler("Unauthorized, Please log in!", 401);
  }
  const decodedToken = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key"),
  );
  if (!decodedToken) {
    throw new ErrorHandler("Invalid token, Please log in again!", 401);
  }
  const userId = decodedToken?.payload?.id as number;
  const user = await users.findByPk(userId);

  if (!user) {
    throw new ErrorHandler("User not foundS!", 404);
  }

  // console.log("Authenticated User:", user?.toJSON());
  req.user = user; // Attach the user object to the request for downstream use
  next();
});

export default authenticate;
