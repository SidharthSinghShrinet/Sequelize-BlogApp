import expressAsyncHandler from "express-async-handler";
import express from "express";
import bookmarks from "../model/bookmark.model.ts";
import blogs from "../model/blog.model.ts";
import projects from "../model/project.model.ts";
import users from "../model/user.model.ts";
import ErrorHandler from "../utils/errorHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.ts";

const toggleBookmark = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const userId = req.user?.toJSON().id;
        const { blogId, projectId } = req.body;

        if (!blogId && !projectId) {
            throw new ErrorHandler("Please provide either blogId or projectId to bookmark.", 400);
        }

        if (blogId && projectId) {
            throw new ErrorHandler("You cannot bookmark both a blog and a project in a single request.", 400);
        }

        if (blogId) {
            // Verify blog exists
            const blogExists = await blogs.findOne({ where: { id: blogId, isActive: true } });
            if (!blogExists) {
                throw new ErrorHandler("Blog post not found or inactive.", 404);
            }

            // Find existing bookmark
            const existing = await bookmarks.findOne({ where: { userId, blogId } });
            if (existing) {
                await existing.destroy();
                return new ApiResponse(200, true, "Bookmark removed successfully", { bookmarked: false }).send(res);
            } else {
                await bookmarks.create({ userId, blogId });
                return new ApiResponse(201, true, "Bookmark added successfully", { bookmarked: true }).send(res);
            }
        }

        if (projectId) {
            // Verify project exists
            const projectExists = await projects.findOne({ where: { id: projectId } });
            if (!projectExists) {
                throw new ErrorHandler("Project showcase not found.", 404);
            }

            // Find existing bookmark
            const existing = await bookmarks.findOne({ where: { userId, projectId } });
            if (existing) {
                await existing.destroy();
                return new ApiResponse(200, true, "Bookmark removed successfully", { bookmarked: false }).send(res);
            } else {
                await bookmarks.create({ userId, projectId });
                return new ApiResponse(201, true, "Bookmark added successfully", { bookmarked: true }).send(res);
            }
        }
    }
);

const getMyBookmarks = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const userId = req.user?.toJSON().id;

        const allBookmarks = await bookmarks.findAll({
            where: { userId },
            include: [
                {
                    model: blogs,
                    as: "blog",
                    where: { isActive: true },
                    required: false,
                    include: [
                        {
                            model: users,
                            as: "authorDetails",
                            attributes: ["id", "username", "email"]
                        }
                    ]
                },
                {
                    model: projects,
                    as: "project",
                    required: false,
                    include: [
                        {
                            model: users,
                            as: "ownerDetails",
                            attributes: ["id", "username", "email"]
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        // Filter and map out non-null records (in case some items were deleted)
        const bookmarkedBlogs = allBookmarks.filter((b: any) => b.blog !== null).map((b: any) => b.blog);
        const bookmarkedProjects = allBookmarks.filter((b: any) => b.project !== null).map((b: any) => b.project);

        return new ApiResponse(200, true, "My bookmarks retrieved successfully", {
            blogs: bookmarkedBlogs,
            projects: bookmarkedProjects
        }).send(res);
    }
);

export { toggleBookmark, getMyBookmarks };
