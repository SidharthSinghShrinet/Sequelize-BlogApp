import expressAsyncHandler from "express-async-handler";
import express from "express";
import ErrorHandler from "../utils/errorHandler.utils";
import blogs from "../model/blog.model";
import ApiResponse from "../utils/ApiResponse.utils";
import users from "../model/user.model";
const createBlog = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const userId = req.user?.toJSON().id;
    const { title, content } = req.body;
    if (!title || !content) {
      throw new ErrorHandler(
        "Title and content are required to create a blog!",
        400,
      );
    }
    const newBlog = await blogs.create({
      title,
      content,
      author: userId,
    });
    if (!newBlog) {
      throw new ErrorHandler("Failed to create blog, Please try again!", 500);
    }
    return new ApiResponse(
      201,
      true,
      "Blog created successfully!",
      newBlog,
    ).send(res);
  },
);

const getAllBlogs = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const allBlogs = await blogs.findAll({
      include: [
        {
          model: users,
          as: "authorDetails",
          attributes: ["id", "username", "email", "phoneNumber"],
        },
      ],
    });
    return new ApiResponse(
      200,
      true,
      "Blogs retrieved successfully!",
      allBlogs,
    ).send(res);
  },
);

const getUserBlogs = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const userId = req.user?.toJSON().id;
    const userBlogs = await blogs.findAll({
      where: { author: userId },
      include:[
        {
            model:users,
            as:"authorDetails",
            attributes:["id","username","email","phoneNumber"] 
        }
      ]
    });
    return new ApiResponse(
      200,
      true,
      "User blogs retrieved successfully!",
      userBlogs,
    ).send(res);
  },
);
export { createBlog, getAllBlogs, getUserBlogs };
