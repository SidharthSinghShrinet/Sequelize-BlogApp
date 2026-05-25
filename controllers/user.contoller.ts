import expressAsyncHandler from "express-async-handler";
import userModel from "../model/user.model.ts";
import ErrorHandler from "../utils/errorHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.ts";
// ----------------- REGISTER USER ---------------------------------------------------------------
const registerUser = expressAsyncHandler(async (req, res):Promise<any>   => {
    const {username, email, password, phoneNumber} = req.body;
    if (!username || !email || !password || !phoneNumber) {
        throw new ErrorHandler("Please fill all the required fields for register", 400);
    }
    const newUser = await userModel.create({
        username,
        email,
        password,
        phoneNumber,
    })
    if (!newUser) {
        throw new ErrorHandler("Something went wrong while creating the user", 400);
    }
    return new ApiResponse(201, true, "User created successfully", newUser).send(res);
});

export {
    registerUser
};