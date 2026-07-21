import expressAsyncHandler from "express-async-handler";
import express from "express";
import comments from "../model/comment.model.ts";
import blogs from "../model/blog.model.ts";
import projects from "../model/project.model.ts";
import users from "../model/user.model.ts";
import ErrorHandler from "../utils/errorHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.ts";

const createComment = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const authorId = req.user?.toJSON().id;
    const { content, blogId, projectId, parentId } = req.body;

    if (!content || !content.trim()) {
      throw new ErrorHandler("Comment content cannot be empty.", 400);
    }

    if (!blogId && !projectId) {
      throw new ErrorHandler("Please specify either a blogId or a projectId.", 400);
    }

    if (blogId && projectId) {
      throw new ErrorHandler("Cannot comment on both a blog and a project simultaneously.", 400);
    }

    if (blogId) {
      const blogExists = await blogs.findOne({ where: { id: blogId, isActive: true } });
      if (!blogExists) {
        throw new ErrorHandler("Target blog post not found or inactive.", 404);
      }
    }

    if (projectId) {
      const projectExists = await projects.findOne({ where: { id: projectId } });
      if (!projectExists) {
        throw new ErrorHandler("Target project showcase not found.", 404);
      }
    }

    if (parentId) {
      const parentComment: any = await comments.findOne({ where: { id: parentId } });
      if (!parentComment) {
        throw new ErrorHandler("Parent comment not found.", 404);
      }
      if (blogId && Number(parentComment.blogId) !== Number(blogId)) {
        throw new ErrorHandler("Parent comment does not belong to this blog post.", 400);
      }
      if (projectId && Number(parentComment.projectId) !== Number(projectId)) {
        throw new ErrorHandler("Parent comment does not belong to this project showcase.", 400);
      }
    }

    const newComment: any = await comments.create({
      content: content.trim(),
      authorId,
      blogId: blogId || null,
      projectId: projectId || null,
      parentId: parentId || null,
    });

    const fullComment = await comments.findOne({
      where: { id: newComment.id },
      include: [
        {
          model: users,
          as: "authorDetails",
          attributes: ["id", "username", "email", "profileImage"],
        },
      ],
    });

    return new ApiResponse(201, true, "Comment created successfully", fullComment).send(res);
  }
);

const getBlogComments = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { blogId } = req.params;

    const commentList = await comments.findAll({
      where: { blogId },
      include: [
        {
          model: users,
          as: "authorDetails",
          attributes: ["id", "username", "email", "profileImage"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return new ApiResponse(200, true, "Blog comments retrieved successfully", commentList).send(res);
  }
);

const getProjectComments = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const { projectId } = req.params;

    const commentList = await comments.findAll({
      where: { projectId },
      include: [
        {
          model: users,
          as: "authorDetails",
          attributes: ["id", "username", "email", "profileImage"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return new ApiResponse(200, true, "Project comments retrieved successfully", commentList).send(res);
  }
);

const deleteComment = expressAsyncHandler(
  async (req: express.Request, res: express.Response): Promise<any> => {
    const userId = req.user?.toJSON().id;
    const { id } = req.params;

    const comment: any = await comments.findOne({ where: { id } });
    if (!comment) {
      throw new ErrorHandler("Comment not found.", 404);
    }

    let isAuthorized = comment.authorId === userId;

    if (!isAuthorized && comment.blogId) {
      const blog: any = await blogs.findOne({ where: { id: comment.blogId } });
      if (blog && blog.author === userId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized && comment.projectId) {
      const project: any = await projects.findOne({ where: { id: comment.projectId } });
      if (project && project.ownerId === userId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new ErrorHandler("You are not authorized to delete this comment.", 403);
    }

    await comment.destroy();

    return new ApiResponse(200, true, "Comment deleted successfully", null).send(res);
  }
);

export { createComment, getBlogComments, getProjectComments, deleteComment };
