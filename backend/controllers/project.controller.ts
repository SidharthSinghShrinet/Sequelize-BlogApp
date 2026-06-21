import expressAsyncHandler from "express-async-handler";
import express from "express";
import ErrorHandler from "../utils/errorHandler.utils";
import ApiResponse from "../utils/ApiResponse.utils";
import projects from "../model/project.model";
import users from "../model/user.model";
import blogs from "../model/blog.model";
import media from "../model/media.model";
import { uploadStream } from "../utils/cloudinary.utils";
import { generateSmartBlogCover } from "../utils/ai.utils";

// Create Project
const createProject = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const ownerId = req.user?.toJSON().id;
        const { title, tagline, description, techStack, githubUrl, liveUrl } = req.body;

        if (!title || !tagline || !description || !techStack) {
            throw new ErrorHandler("Title, tagline, description, and tech stack are required!", 400);
        }

        let thumbnailUrl = null;
        let aiCoverResult = null;

        // If file uploaded, upload to Cloudinary
        if (req.file) {
            const uploadResult = await uploadStream(req);
            if (uploadResult) {
                thumbnailUrl = uploadResult.secure_url;
                aiCoverResult = {
                    publicId: uploadResult.public_id,
                    url: uploadResult.secure_url,
                    bytes: uploadResult.bytes
                };
            }
        } else {
            // Generate dynamic AI cover art based on title
            const aiThumbnail = await generateSmartBlogCover(title);
            if (aiThumbnail) {
                thumbnailUrl = aiThumbnail.url;
                aiCoverResult = aiThumbnail;
            }
        }

        const newProject = await projects.create({
            title,
            tagline,
            description,
            techStack,
            githubUrl: githubUrl || null,
            liveUrl: liveUrl || null,
            thumbnail: thumbnailUrl,
            ownerId
        });

        if (!newProject) {
            throw new ErrorHandler("Failed to create project!", 500);
        }

        const newProjectData: any = newProject.toJSON();

        // Track image in media database
        if (aiCoverResult) {
            await media.create({
                publicId: aiCoverResult.publicId,
                url: aiCoverResult.url,
                bytes: aiCoverResult.bytes,
                status: "active"
            });
        }

        return new ApiResponse(201, true, "Project created successfully!", newProject).send(res);
    }
);

// Get All Projects (Showcase Hub)
const getAllProjects = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const allProjects = await projects.findAll({
            include: [
                {
                    model: users,
                    as: "ownerDetails",
                    attributes: ["id", "username", "email"]
                },
                {
                    model: blogs,
                    as: "devlogs",
                    attributes: ["id"],
                    where: { isActive: true },
                    required: false
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        // Map count of devlogs and clean up response payload size
        const formatted = allProjects.map((proj: any) => {
            const json = proj.toJSON();
            json.devlogsCount = json.devlogs?.length || 0;
            delete json.devlogs;
            return json;
        });

        return new ApiResponse(200, true, "Projects retrieved successfully!", formatted).send(res);
    }
);

// Get Single Project (Portfolio view + Timeline devlogs)
const getProjectById = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const { id } = req.params;

        const project = await projects.findOne({
            where: { id },
            include: [
                {
                    model: users,
                    as: "ownerDetails",
                    attributes: ["id", "username", "email"]
                },
                {
                    model: blogs,
                    as: "devlogs",
                    where: { isActive: true },
                    required: false,
                    include: [
                        {
                            model: users,
                            as: "authorDetails",
                            attributes: ["id", "username"]
                        }
                    ]
                }
            ],
            order: [
                [{ model: blogs, as: "devlogs" }, "createdAt", "ASC"]
            ]
        });

        if (!project) {
            throw new ErrorHandler("Project not found!", 404);
        }

        return new ApiResponse(200, true, "Project retrieved successfully!", project).send(res);
    }
);

// Update Project
const updateProject = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const { id } = req.params;
        const ownerId = req.user?.toJSON().id;
        const { title, tagline, description, techStack, githubUrl, liveUrl } = req.body;

        const project = await projects.findOne({ where: { id, ownerId } });
        if (!project) {
            throw new ErrorHandler("Project not found or unauthorized!", 404);
        }

        let thumbnailUrl = project.getDataValue("thumbnail");
        let aiCoverResult = null;

        if (req.file) {
            const uploadResult = await uploadStream(req);
            if (uploadResult) {
                thumbnailUrl = uploadResult.secure_url;
                aiCoverResult = {
                    publicId: uploadResult.public_id,
                    url: uploadResult.secure_url,
                    bytes: uploadResult.bytes
                };
            }
        }

        await projects.update(
            {
                title,
                tagline,
                description,
                techStack,
                githubUrl: githubUrl || null,
                liveUrl: liveUrl || null,
                thumbnail: thumbnailUrl
            },
            {
                where: { id, ownerId }
            }
        );

        if (aiCoverResult) {
            await media.create({
                publicId: aiCoverResult.publicId,
                url: aiCoverResult.url,
                bytes: aiCoverResult.bytes,
                status: "active"
            });
        }

        return new ApiResponse(200, true, "Project updated successfully!", null).send(res);
    }
);

// Delete Project
const deleteProject = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const { id } = req.params;
        const ownerId = req.user?.toJSON().id;

        const project = await projects.findOne({ where: { id, ownerId } });
        if (!project) {
            throw new ErrorHandler("Project not found or unauthorized!", 404);
        }

        await projects.destroy({ where: { id, ownerId } });

        return new ApiResponse(200, true, "Project deleted successfully!", null).send(res);
    }
);

// Get User Projects (For CreateBlog dropdown selection)
const getUserProjects = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const ownerId = req.user?.toJSON().id;

        const userProjects = await projects.findAll({
            where: { ownerId },
            attributes: ["id", "title"],
            order: [["createdAt", "DESC"]]
        });

        return new ApiResponse(200, true, "User projects retrieved successfully!", userProjects).send(res);
    }
);

// Get Github Readme
const getGithubReadme = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const { githubUrl } = req.query;

        if (!githubUrl || typeof githubUrl !== "string") {
            throw new ErrorHandler("GitHub Repository URL is required!", 400);
        }

        // Parse github URL
        let owner = "";
        let repo = "";

        const cleanUrl = githubUrl
            .trim()
            .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "")
            .replace(/\.git$/i, "")
            .replace(/\/$/, "");

        const parts = cleanUrl.split("/");
        if (parts.length >= 2) {
            owner = (parts[0] || "").replace(/[{}]/g, "");
            repo = (parts[1] || "").replace(/[{}]/g, "");
        }

        if (!owner || !repo) {
            throw new ErrorHandler("Invalid GitHub Repository URL. Expected format: github.com/owner/repo", 400);
        }

        try {
            const headers: Record<string, string> = {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Showoff-App"
            };

            if (process.env.GITHUB_TOKEN) {
                headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
            }

            const githubApiResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/readme`,
                { headers }
            );

            if (githubApiResponse.status === 404) {
                throw new ErrorHandler(`README file not found in repository: ${owner}/${repo}`, 404);
            }

            if (!githubApiResponse.ok) {
                throw new ErrorHandler(`Failed to fetch from GitHub API: ${githubApiResponse.statusText}`, githubApiResponse.status);
            }

            const data: any = await githubApiResponse.json();
            const { content, encoding } = data;

            if (!content) {
                throw new ErrorHandler("README file is empty.", 404);
            }

            let decodedReadme = "";
            if (encoding === "base64") {
                decodedReadme = Buffer.from(content, "base64").toString("utf-8");
            } else {
                decodedReadme = content;
            }

            return new ApiResponse(200, true, "README fetched successfully!", { readme: decodedReadme }).send(res);
        } catch (err: any) {
            if (err instanceof ErrorHandler) {
                throw err;
            }
            throw new ErrorHandler(err.message || "Failed to fetch README from GitHub", 500);
        }
    }
);

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getUserProjects,
    getGithubReadme
};
