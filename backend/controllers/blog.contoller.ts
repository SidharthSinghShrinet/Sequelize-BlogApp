import expressAsyncHandler from "express-async-handler";
import express from "express";
import { Op } from "sequelize";
import ErrorHandler from "../utils/errorHandler.utils";
import blogs from "../model/blog.model";
import media from "../model/media.model";
import ApiResponse from "../utils/ApiResponse.utils";
import users from "../model/user.model";
import { uploadStream, uploadBufferToCloudinary } from "../utils/cloudinary.utils";
import { generateSmartBlogCover } from "../utils/ai.utils";
import { getCategoryForBlog } from "../utils/category.utils";

const activateMediaForBlog = async (content: string, blogId: number) => {
    try {
        const imgRegex = /<img[^>]+src="([^">]+)"/gi;
        const urls: string[] = [];
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
            if (match[1]) {
                urls.push(match[1]);
            }
        }

        if (urls.length > 0) {
            await media.update(
                { status: "active", associatedBlogId: blogId },
                {
                    where: {
                        url: {
                            [Op.in]: urls
                        }
                    }
                }
            );
        }
    } catch (err) {
        console.error("Failed to activate media for blog:", err);
    }
};

const updateMediaForBlog = async (content: string, blogId: number) => {
    try {
        const imgRegex = /<img[^>]+src="([^">]+)"/gi;
        const currentUrls: string[] = [];
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
            if (match[1]) {
                currentUrls.push(match[1]);
            }
        }

        const associatedMedia = await media.findAll({
            where: { associatedBlogId: blogId }
        });

        for (const asset of associatedMedia) {
            const assetData: any = asset.toJSON();
            if (!currentUrls.includes(assetData.url)) {
                await asset.update({
                    status: "pending",
                    associatedBlogId: null
                });
            }
        }

        if (currentUrls.length > 0) {
            await media.update(
                { status: "active", associatedBlogId: blogId },
                {
                    where: {
                        url: {
                            [Op.in]: currentUrls
                        }
                    }
                }
            );
        }
    } catch (err) {
        console.error("Failed to update media status for blog:", err);
    }
};

const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const createBlog = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const userId = req.user?.toJSON().id;
        const { title, content, projectId } = req.body;
        if (!title || !content) {
            throw new ErrorHandler(
                "Title and content are required to create a blog!",
                400,
            );
        }

        // Check if content has any inline images
        const hasInlineImage = /<img[^>]+src="([^">]+)"/i.test(content);
        let thumbnailUrl = null;
        let aiCoverResult = null;

        if (!hasInlineImage) {
            const aiThumbnail = await generateSmartBlogCover(title);
            if (aiThumbnail) {
                thumbnailUrl = aiThumbnail.url;
                aiCoverResult = aiThumbnail;
            }
        }

        const category = getCategoryForBlog(title, content);

        const newBlog = await blogs.create({
            title,
            content,
            author: userId,
            thumbnail: thumbnailUrl,
            projectId: projectId || null,
            category
        });
        if (!newBlog) {
            throw new ErrorHandler("Failed to create blog, Please try again!", 500);
        }

        // Activate and link uploaded images to the new blog
        const newBlogData: any = newBlog.toJSON();
        await activateMediaForBlog(content, newBlogData.id);

        // Register the generated cover in the media table as active
        if (aiCoverResult) {
            await media.create({
                publicId: aiCoverResult.publicId,
                url: aiCoverResult.url,
                bytes: aiCoverResult.bytes,
                status: "active",
                associatedBlogId: newBlogData.id
            });
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const search = (req.query.search as string) || "";
        const category = (req.query.category as string) || "";
        const all = req.query.all === "true";
        
        const whereConditions: any = { isActive: true };
        
        if (search) {
            whereConditions[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } }
            ];
        }
        
        if (category) {
            if (whereConditions[Op.or]) {
                whereConditions[Op.and] = [
                    { [Op.or]: whereConditions[Op.or] },
                    { category: category === "general" ? [null, "general"] : category }
                ];
                delete whereConditions[Op.or];
            } else {
                whereConditions.category = category === "general" ? [null, "general"] : category;
            }
        }
        
        const queryOptions: any = {
            where: whereConditions,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: users,
                    as: "authorDetails",
                    attributes: ["id", "username", "email", "phoneNumber"],
                },
            ],
        };
        
        if (!all) {
            queryOptions.limit = limit;
            queryOptions.offset = (page - 1) * limit;
        }
        
        const { count, rows: resultBlogs } = await blogs.findAndCountAll(queryOptions);
        
        const totalPages = all ? 1 : Math.ceil(count / limit);
        
        const responseData = all ? resultBlogs : {
            blogs: resultBlogs,
            pagination: {
                totalItems: count,
                totalPages,
                currentPage: page,
                limit
            }
        };

        return new ApiResponse(
            200,
            true,
            "Blogs retrieved successfully!",
            responseData,
        ).send(res);
    },
);

const getUserBlogs = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const userId = req.user?.toJSON().id;
        const userBlogs = await blogs.findAll({
            where: { author: userId, isActive: true },
            include: [
                {
                    model: users,
                    as: "authorDetails",
                    attributes: ["id", "username", "email", "phoneNumber"]
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

const getBlogById = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
    const { id } = req.params;
    console.log(typeof id);
    const blog = await blogs.findOne(
        {
            where: { id: id, isActive: true },
            include: [
                {
                    model: users,
                    attributes: ["id", "username", "email", "phoneNumber"],
                    as: "authorDetails"
                }
            ]
        });
    if (!blog) {
        throw new ErrorHandler("Blog not found!", 404);
    }
    return new ApiResponse(
        200,
        true,
        "Blog retrieved successfully!",
        blog,
    ).send(res);
})

const updateBlog = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
    const { id } = req.params;
    const userId = req.user?.toJSON().id;
    const { title, content, projectId } = req.body;
    if (!title || !content) {
        throw new ErrorHandler("Title and content are required to update a blog!", 404);
    }
    const category = getCategoryForBlog(title, content);
    const [affectedCount,] = await blogs.update(
        { title, content, projectId: projectId || null, category },
        { where: { author: userId, id: id, isActive: true } },
    )
    if (!affectedCount) {
        throw new ErrorHandler("Blog not found!", 404);
    }

    // Sync media assets after update (linking new images, freeing removed ones)
    await updateMediaForBlog(content, Number(id));

    return new ApiResponse(
        200,
        true,
        "Blog updated successfully!", null).send(res);
})

const deleteBlog = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
    const { id } = req.params;
    const userId = req.user?.toJSON().id;
    const blog = await blogs.findOne({
        where: {
            id: id,
            author: userId,
            isActive: true,
        }
    });
    if (!blog) {
        throw new ErrorHandler("Blog not found!", 404);
    }
    await blogs.update({
        isActive: false
    },
        {
            where: {
                id: id,
                author: userId,
            }
        });

    // Mark all media files associated with this blog as pending so the cron job cleans them up
    await media.update(
        { status: "pending", associatedBlogId: null },
        { where: { associatedBlogId: Number(id) } }
    );

    return new ApiResponse(
        200,
        true,
        "Blog deleted successfully!", null).send(res);
})

const deleteALlBlog = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
    const userId = req.user?.toJSON().id;

    // Find all active blogs for this user first so we can mark their media as pending
    const userBlogs = await blogs.findAll({
        where: { author: userId, isActive: true }
    });
    const blogIds = userBlogs.map((b: any) => b.id);

    await blogs.update({ isActive: false }, { where: { author: userId, isActive: true } });

    if (blogIds.length > 0) {
        await media.update(
            { status: "pending", associatedBlogId: null },
            { where: { associatedBlogId: { [Op.in]: blogIds } } }
        );
    }

    return new ApiResponse(200, true, "All blogs deleted successfully!", null).send(res);
})

const getAllDeletedBlogs = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
    const userId = req.user?.toJSON().id;
    const deletedBlogs = await blogs.findAll({
        where: { author: userId, isActive: false },
    });
    return new ApiResponse(200, true, "Deleted blogs retrieved successfully!", deletedBlogs).send(res);
})


const uploadImage = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
    if (!req.file) {
        throw new ErrorHandler("Please upload an image!", 400);
    }
    const result = await uploadStream(req);
    if (!result) {
        throw new ErrorHandler("Failed to upload image!", 500);
    }

    // Save a record in media tracking table with status 'pending'
    await media.create({
        publicId: result.public_id,
        url: result.secure_url,
        bytes: result.bytes,
        status: "pending"
    });

    return new ApiResponse(
        200,
        true,
        "Image uploaded successfully!",
        result,
    ).send(res);
})

const testAiPrompt = expressAsyncHandler(async (req: express.Request, res: express.Response): Promise<any> => {
    const { title } = req.body;
    if (!title) {
        throw new ErrorHandler("Title is required to test AI prompt!", 400);
    }
    
    const artDirectorPrompt = `You are a creative Art Director. Analyze this blog title: "${title}". Design a beautiful, high-quality visual concept for an article cover representing this specific topic. Write a single, descriptive sentence describing the composition of this image (objects, background, lighting, and mood). Make it a conceptual metaphor or visual scene that is highly relevant and recognizable for the topic. If there are iconic symbols or visual metaphors commonly associated with the specific topic (such as databases, servers, gears, networks, locks, lightbulbs, atomic orbits, interlocking loops, or layers), creatively incorporate them into a modern artistic composition. STRICT RULES: 1. Start your response directly with the image description (e.g., "A..." or "An..."). Do not include any intro, thinking, notes, or meta-commentary. 2. Do not include any words, letters, text, alphabets, or typography in the description. 3. Do not include code syntax, code snippets, or user interface (UI) screens. 4. Describe only visual objects, colors, and art style. Use a professional, clean, and modern artistic aesthetic. 5. Avoid animal metaphors (like spiders, octopuses, etc.) or literal physical tools (like fishing hooks). Focus on abstract, geometric, digital, or technology-based representations.`;

    const pollinationsKey = process.env.POLLINATIONS_API_KEY;
    const textHeaders: Record<string, string> = {
        "Content-Type": "application/json"
    };
    if (pollinationsKey) {
        textHeaders["Authorization"] = `Bearer ${pollinationsKey}`;
    }

    const textResponse = await fetch(
        "https://gen.pollinations.ai/v1/chat/completions",
        {
            method: "POST",
            headers: textHeaders,
            body: JSON.stringify({
                model: "mistral-small-3.2",
                messages: [{ role: "user", content: artDirectorPrompt }],
                max_tokens: 100
            })
        }
    );

    if (!textResponse.ok) {
        const errorText = await textResponse.text();
        throw new Error(`Text generation failed: ${errorText}`);
    }

    const textData: any = await textResponse.json();
    const generatedBrief = textData.choices?.[0]?.message?.content?.trim();

    return new ApiResponse(
        200,
        true,
        "AI visual brief generated successfully!",
        { brief: generatedBrief }
    ).send(res);
});

const getPlatformAnalytics = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const totalArticles = await blogs.count({ where: { isActive: true } });
        const coverCount = await blogs.count({
            where: {
                isActive: true,
                thumbnail: { [Op.ne]: null }
            }
        });

        // 1. Calculate reading time
        const allActiveBlogs = await blogs.findAll({
            attributes: ["content"],
            where: { isActive: true }
        });

        let totalReadingTime = 0;
        const wordsPerMinute = 200;
        for (const blog of allActiveBlogs) {
            const content = blog.getDataValue("content") || "";
            const cleanText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            const words = cleanText.split(/\s+/).filter((w: string) => w.length > 0).length;
            totalReadingTime += Math.max(1, Math.ceil(words / wordsPerMinute));
        }
        const avgReadingTime = totalArticles > 0 ? Math.round(totalReadingTime / totalArticles) : 0;

        // 2. Sum the exact bytes from the purged media assets.
        // We handle legacy records where status = "purged" but bytes is null by providing 254 KB (260096 bytes) fallback.
        const totalBytesResult = await media.sum("bytes", { where: { status: "purged" } });
        const legacyCount = await media.count({
            where: {
                status: "purged",
                bytes: null
            }
        });
        const totalStorageSavedBytes = (totalBytesResult || 0) + (legacyCount * 260096);

        return new ApiResponse(
            200,
            true,
            "Platform analytics retrieved successfully!",
            {
                totalArticles,
                coverCount,
                avgReadingTime,
                totalStorageSavedBytes
            }
        ).send(res);
    }
);

const getCategoryCounts = expressAsyncHandler(
    async (req: express.Request, res: express.Response): Promise<any> => {
        const categories = ["frontend", "backend", "databases", "devops", "ai", "general"];
        const countsObj: Record<string, number> = {
            frontend: 0,
            backend: 0,
            databases: 0,
            devops: 0,
            ai: 0,
            general: 0
        };
        
        for (const cat of categories) {
            countsObj[cat] = await blogs.count({
                where: {
                    isActive: true,
                    category: cat === "general" ? [null, "general"] : cat
                }
            });
        }
        
        return new ApiResponse(
            200,
            true,
            "Category counts retrieved successfully!",
            countsObj
        ).send(res);
    }
);

export { createBlog, getAllBlogs, getUserBlogs, getBlogById, updateBlog, deleteBlog, deleteALlBlog, getAllDeletedBlogs, uploadImage, testAiPrompt, getPlatformAnalytics, getCategoryCounts };
