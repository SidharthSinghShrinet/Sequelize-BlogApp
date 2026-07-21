import { DataTypes } from "sequelize";
import sequelize from "../config/db.ts";

const comments = sequelize.define(
  "comments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "author_id",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
      onUpdate: "CASCADE",
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
      onUpdate: "CASCADE",
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "parent_id",
      references: {
        model: "comments",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    underscored: true,
  }
);

export default comments;
