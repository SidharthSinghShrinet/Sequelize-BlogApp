import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const projects = sequelize.define(
    "projects",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tagline: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        techStack: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "tech_stack",
        },
        githubUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "github_url",
        },
        liveUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "live_url",
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "owner_id",
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    },
    {
        tableName: "projects",
        timestamps: true,
        underscored: true,
    }
);

export default projects;
