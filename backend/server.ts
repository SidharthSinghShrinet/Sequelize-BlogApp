import { configDotenv } from "dotenv";
configDotenv();

import app from "./app.ts";
import sequelize from "./config/db.ts";
import "./model/media.model.ts";
import blogs from "./model/blog.model.ts";
import { getCategoryForBlog } from "./utils/category.utils.ts";

import { initCronJobs } from "./config/cron.ts";

async function backfillCategories() {
  try {
    const unclassifiedBlogs = await blogs.findAll({
      where: {
        category: null
      }
    });
    if (unclassifiedBlogs.length > 0) {
      console.log(`⏳ Found ${unclassifiedBlogs.length} unclassified blogs. Starting backfill...`);
      for (const blog of unclassifiedBlogs) {
        const title = blog.getDataValue("title");
        const content = blog.getDataValue("content");
        const category = getCategoryForBlog(title, content);
        await blog.update({ category });
      }
      console.log("✅ Backfill completed successfully.");
    } else {
      console.log("✅ No unclassified blogs found.");
    }
  } catch (err) {
    console.error("❌ Failed to backfill blog categories:", err);
  }
}

async function startConnection() {
  try {
    // 1. Authenticate
    await sequelize.authenticate();
    console.log("🔗 Connection has been established successfully.");
    // 2. Sync with alter mode enabled to automatically add columns (like category)
    await sequelize.sync({ alter: true });
    console.log("👌 All models were synchronized successfully:- ALTER MODE");
    // 3. Backfill category columns for any existing blogs
    await backfillCategories();
    // 4. Start Server
    app.listen(process.env.PORT, (err) => {
      if (err) throw err;
      console.log("✅ Server is running on port: " + process.env.PORT);
      initCronJobs();
    });
  } catch (e) {
    console.error("Error occurred while starting the connection:", e);
    process.exit(1);
  }
}

startConnection()
  .then(() => {
    console.log(
      "✅ Database connection established and server started successfully.",
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
