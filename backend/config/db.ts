import { Sequelize } from "sequelize";

const isCloudDb = process.env.DB_HOST?.includes("aivencloud.com") || process.env.DB_SSL === "true";

const sequelize: Sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT || "3306", 10),
        dialect: "mysql",
        logging: process.env.NODE_ENV === "production" ? false : console.log,
        pool: {
            max: parseInt(process.env.DB_POOL_MAX || "10", 10),
            min: parseInt(process.env.DB_POOL_MIN || "2", 10),
            acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
            idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
            evict: parseInt(process.env.DB_POOL_EVICT || "1000", 10),
        },
        dialectOptions: {
            connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || "60000", 10),
            ...(isCloudDb
                ? {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                }
                : {}),
        },
    }
);

export default sequelize;