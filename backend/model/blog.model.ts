import {DataTypes} from "sequelize";
import sequelize from "../config/db";

const blogs = sequelize.define(
    "blogs",
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
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        author: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "project_id",
            references: {
                model: "projects",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        isActive: {
            type:DataTypes.BOOLEAN,
            defaultValue: true,
        }
    },
    {
        tableName: "blogs",
        timestamps: true,
        underscored: true,
    },
);

export default blogs;
