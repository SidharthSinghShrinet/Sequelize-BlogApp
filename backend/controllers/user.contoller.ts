import express from "express";
import expressAsyncHandler from "express-async-handler";
import userModel from "../model/user.model.ts";
import ErrorHandler from "../utils/errorHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.ts";
import generateToken from "../utils/jwt.utils.ts";
import { uploadBufferToCloudinary } from "../utils/cloudinary.utils.ts";
import crypto from "node:crypto";
import { Op } from "sequelize";
import { sendResetPasswordEmail } from "../utils/email.utils.ts";

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

    if (password.length < 6 || password.length > 20) {
      throw new ErrorHandler("Password must be between 6 and 20 characters", 400);
    }

    // Check if username is already taken by an active user
    const existingUsername = await userModel.findOne({
      where: { username, isActive: true }
    });
    if (existingUsername) {
      throw new ErrorHandler("Username is already taken", 400);
    }

    // Check if email is already taken by an active user
    const existingEmail = await userModel.findOne({
      where: { email, isActive: true }
    });
    if (existingEmail) {
      throw new ErrorHandler("Email is already registered", 450);
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

    if (req.file) {
      try {
        const mimeType = req.file.mimetype || "image/png";
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "profile_images", mimeType);
        newUser.setDataValue("profileImage", uploadResult.secure_url);
        await newUser.save();
      } catch (uploadError) {
        console.error("Cloudinary upload failed for new user avatar:", uploadError);
      }
    }

    const userResponse = newUser.toJSON();
    delete userResponse.password;
    new ApiResponse(201, true, "User created successfully", userResponse).send(res);
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
    new ApiResponse(200, true, "Login successful").send(res);
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
    const userResponse = req.user ? req.user.toJSON() : null;
    if (userResponse) {
      delete userResponse.password;
    }
    new ApiResponse(200, true, "User profile retrieved successfully", userResponse).send(res);
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

    if (username && username !== user.getDataValue("username")) {
      const existingUsername = await userModel.findOne({
        where: { username, isActive: true }
      });
      if (existingUsername) {
        throw new ErrorHandler("Username is already taken", 400);
      }
      user.setDataValue("username", username);
    }

    if (email && email !== user.getDataValue("email")) {
      const existingEmail = await userModel.findOne({
        where: { email, isActive: true }
      });
      if (existingEmail) {
        throw new ErrorHandler("Email is already registered", 400);
      }
      user.setDataValue("email", email);
    }

    if (phoneNumber) user.setDataValue("phoneNumber", phoneNumber);
    if (password) {
      if (password.length < 6 || password.length > 20) {
        throw new ErrorHandler("Password must be between 6 and 20 characters", 400);
      }
      user.setDataValue("password", password); // will be hashed automatically by userModel.beforeUpdate
    }

    if (req.file) {
      try {
        const mimeType = req.file.mimetype || "image/png";
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "profile_images", mimeType);
        user.setDataValue("profileImage", uploadResult.secure_url);
      } catch (uploadError) {
        console.error("Cloudinary upload failed for user profile update:", uploadError);
      }
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
  console.log("User:", user);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  const userId = (req.user as any).id;
  const username = user.getDataValue("username");

  await userModel.update(
    {
      isActive: false,
      username: `deleted_${username}_${userId}`,
      email: `deleted_${username}_${userId}@deleted.com`
    },
    {
      where: {
        id: userId
      }
    })
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  })
})

const getPublicProfile = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
  const { username } = req.params;
  const user = await userModel.findOne({
    where: {
      username: username,
      isActive: true
    },
    attributes: ["id", "username", "email", "createdAt", "profileImage"]
  });
  if (!user) {
    throw new ErrorHandler("User not found or is inactive", 404);
  }
  new ApiResponse(200, true, "Public profile retrieved successfully", user).send(res);
})

const forgotPassword = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
  const { email } = req.body;
  if (!email) {
    throw new ErrorHandler("Please provide an email address", 400);
  }

  const user = await userModel.findOne({
    where: { email, isActive: true }
  });
  if (!user) {
    throw new ErrorHandler("No account with that email address exists.", 404);
  }

  // Generate plain random token
  const token = crypto.randomBytes(32).toString("hex");
  
  // Hash the token to store securely in database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
  // Save hash & expiry (5 minutes)
  user.setDataValue("resetPasswordToken", hashedToken);
  user.setDataValue("resetPasswordTokenExpiry", new Date(Date.now() + 5 * 60 * 1000));
  await user.save();

  // Reset URL pointing to frontend containing the plain token in query parameters
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetPasswordURL = `${frontendUrl}/reset-password?token=${token}`;

  try {
    // Send email using Nodemailer utility
    const previewUrl = await sendResetPasswordEmail(email, resetPasswordURL);
    
    // If ethereal test account was used, log the preview URL in console
    if (previewUrl) {
      console.log("\n========================================================");
      console.log(`✉️  [PASSWORD RESET] Email sent successfully to ${email}`);
      console.log(`🔗  Preview Inbox URL: ${previewUrl}`);
      console.log("========================================================\n");
    }
    
    new ApiResponse(200, true, "Password reset link has been sent to your email address.", { previewUrl }).send(res);
  } catch (emailError: any) {
    // If mailer fails, clear database fields and throw error
    user.setDataValue("resetPasswordToken", null);
    user.setDataValue("resetPasswordTokenExpiry", null);
    await user.save();
    console.error("Mailer error during forgotPassword:", emailError);
    throw new ErrorHandler("Failed to send password reset email. Please try again.", 500);
  }
});

const resetPassword = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
  const { token, password, confirmPassword } = req.body;
  if (!token || !password || !confirmPassword) {
    throw new ErrorHandler("Reset token, password, and confirm password are required", 400);
  }

  if (password !== confirmPassword) {
    throw new ErrorHandler("Passwords do not match", 400);
  }

  if (password.length < 6 || password.length > 20) {
    throw new ErrorHandler("Password must be between 6 and 20 characters", 400);
  }

  // Hash incoming plain token to match database record
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Query user where token matches and expiry is in the future
  const user = await userModel.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: {
        [Op.gt]: new Date()
      },
      isActive: true
    }
  });

  if (!user) {
    throw new ErrorHandler("Password reset token is invalid or has expired.", 400);
  }

  // Update password (model beforeUpdate hook will automatically hash this using Bun password hasher)
  user.setDataValue("password", password);
  user.setDataValue("resetPasswordToken", null);
  user.setDataValue("resetPasswordTokenExpiry", null);
  await user.save();

  new ApiResponse(200, true, "Your password has been reset successfully. You can now log in.").send(res);
});

export { registerUser, loginUser, logoutUser, getMe, updateMe, deleteMe, getPublicProfile, forgotPassword, resetPassword };
