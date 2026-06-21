import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const media = sequelize.define(
    "media",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        publicId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "public_id"
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "active", "purged"),
            defaultValue: "pending",
            allowNull: false,
        },
        bytes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        associatedBlogId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "associated_blog_id",
            references: {
                model: "blogs",
                key: "id",
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }
    },
    {
        tableName: "media",
        timestamps: true,
        underscored: true,
    }
);

export default media;
