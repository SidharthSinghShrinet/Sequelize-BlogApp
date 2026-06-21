import cron from "node-cron";
import { Op } from "sequelize";
import media from "../model/media.model";
import cloudinary from "./cloudinary";

export const initCronJobs = () => {
    // Run daily at midnight: "0 0 * * *"
    cron.schedule("0 0 * * *", async () => {
        console.log("⏰ Running scheduled cron job: cleaning up orphaned blog images...");
        
        try {
            // Find all pending media records older than 24 hours (1 day ago)
            const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            const orphanedAssets = await media.findAll({
                where: {
                    status: "pending",
                    createdAt: {
                        [Op.lt]: cutoffTime
                    }
                }
            });

            console.log(`🔍 Found ${orphanedAssets.length} orphaned media files to clean up.`);

            for (const asset of orphanedAssets) {
                const assetData: any = asset.toJSON();
                try {
                    // 1. Delete from Cloudinary
                    const cloudinaryResult = await cloudinary.uploader.destroy(assetData.publicId);
                    
                    // 2. Mark as purged and clear associated blog id in database
                    await asset.update({
                        status: "purged",
                        associatedBlogId: null
                    });
                    
                    console.log(`✅ Cleaned up orphaned asset: ${assetData.publicId} (Cloudinary status: ${cloudinaryResult.result})`);
                } catch (err) {
                    console.error(`❌ Failed to delete asset ${assetData.publicId} from Cloudinary/DB:`, err);
                }
            }
        } catch (error) {
            console.error("❌ Error running cleanup cron job:", error);
        }
    });
    
    console.log("📅 Background cleanup cron jobs initialized successfully (Scheduled for daily at midnight).");
};
