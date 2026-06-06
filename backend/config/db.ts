import {Sequelize} from "sequelize";

const sequelize:Sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        dialect:"mysql",
        logging:console.log,
    }
);

export default sequelize;