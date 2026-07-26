import { Sequelize } from "sequelize";

const isCloudDb = process.env.DB_HOST?.includes("aivencloud.com") || process.env.DB_SSL === "true";

const sequelize: Sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT || "3306"),
        dialect: "mysql",
        logging: process.env.NODE_ENV === "production" ? false : console.log,
        dialectOptions: isCloudDb
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : {},
    }
);

export default sequelize;