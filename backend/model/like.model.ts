import { DataTypes } from "sequelize";
import sequelize from "../config/db.ts";

const likes = sequelize.define("likes", {
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
        allowNull: false,
        field: "blog_id",
        references: {
            model: "blogs",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
}, {
    tableName: "blog_likes",
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ["user_id", "blog_id"]
        }
    ]
});

export default likes;
