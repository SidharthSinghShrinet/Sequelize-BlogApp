import { DataTypes } from "sequelize";
import sequelize from "../config/db.ts";

const bookmarks = sequelize.define("bookmarks", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "blog_id",
        references: {
            model: "blogs",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "project_id",
        references: {
            model: "projects",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
}, {
    tableName: "bookmarks",
    timestamps: true,
    underscored: true,
});

export default bookmarks;
