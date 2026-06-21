import express from "express";
import cloudinary from "../config/cloudinary";

export const uploadBufferToCloudinary = (
    buffer: Buffer,
    folder: string = "blog_images",
    mimeType: string = "image/png"
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
        cloudinary.uploader.upload(
            dataUri,
            {
                folder
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
};

export const uploadStream = (req: express.Request) => {
    if (!req.file || !req.file.buffer) {
        return Promise.reject(new Error("No file buffer present"));
    }
    const mimeType = req.file.mimetype || "image/png";
    return uploadBufferToCloudinary(req.file.buffer, "blog_images", mimeType);
};