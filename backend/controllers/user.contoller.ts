import express from "express";
import expressAsyncHandler from "express-async-handler";
import userModel from "../model/user.model.ts";
import ErrorHandler from "../utils/errorHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.ts";
import generateToken from "../utils/jwt.utils.ts";

//@ ----------------- REGISTER USER ---------------------------------------------------------------
const registerUser = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { username, email, password, phoneNumber } = req.body;
    if (!username || !email || !password || !phoneNumber) {
      throw new ErrorHandler(
        "Please fill all the required fields for register",
        400,
      );
    }
    const newUser = await userModel.create({
      username,
      email,
      password,
      phoneNumber,
    });
    if (!newUser) {
      throw new ErrorHandler(
        "Something went wrong while creating the user",
        400,
      );
    }
    new ApiResponse(201, true, "User created successfully", newUser).send(res);
  },
);

//@----------------- LOGIN USER -------------------------------------------------------------------
const loginUser = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ErrorHandler(
        "Please fill all the required fields for login",
        400,
      );
    }
    const existingUser = await userModel.findOne({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw new ErrorHandler("Invalid email or password", 400);
    }
    const isMatched = await Bun.password.verify(
      password,
      existingUser.getDataValue("password"),
    );
    if (!isMatched) {
      throw new ErrorHandler("Invalid email or password", 400);
    }
    const token = await generateToken(existingUser.getDataValue("id"));
    if (!token) {
      throw new ErrorHandler("Failed to generate token", 500);
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    new ApiResponse(200, true, "Login successful", { token, user: existingUser }).send(res);
  },
);

const logoutUser = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    res.clearCookie("token");
    new ApiResponse(200, true, "User logged out successfullyz").send(res);
  },
);

const getMe = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    new ApiResponse(200, true, "User profile retrieved successfully", req.user).send(res);
  }
);

const updateMe = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { username, email, phoneNumber, password } = req.body;

    // Find user model
    const user = await userModel.findByPk((req.user as any).id);
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (username) user.setDataValue("username", username);
    if (email) user.setDataValue("email", email);
    if (phoneNumber) user.setDataValue("phoneNumber", phoneNumber);
    if (password) {
      if (password.length < 6 || password.length > 20) {
        throw new ErrorHandler("Password must be between 6 and 20 characters", 400);
      }
      user.setDataValue("password", password); // will be hashed automatically by userModel.beforeUpdate
    }

    await user.save();

    // Return updated user (excluding sensitive fields like password)
    const responseUser = user.toJSON();
    delete responseUser.password;

    new ApiResponse(200, true, "User profile updated successfully", responseUser).send(res);
  }
);

const deleteMe = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
  const user = await userModel.findByPk((req.user as any).id);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }
  await userModel.destroy({
    where: {
      id: (req.user as any).id
    }
  })
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  })
})

export { registerUser, loginUser, logoutUser, getMe, updateMe, deleteMe };
