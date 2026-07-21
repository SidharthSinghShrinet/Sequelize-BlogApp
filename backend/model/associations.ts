import users from "./user.model";
import blogs from "./blog.model";
import projects from "./project.model";
import bookmarks from "./bookmark.model.ts";
import comments from "./comment.model.ts";

// User & Blogs
users.hasMany(blogs, {
  foreignKey: "author",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "blogs",
});

blogs.belongsTo(users, {
  foreignKey: "author",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "authorDetails",
});

// User & Projects
users.hasMany(projects, {
  foreignKey: "ownerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "projects",
});

projects.belongsTo(users, {
  foreignKey: "ownerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "ownerDetails",
});

// Projects & Blogs (Devlogs)
projects.hasMany(blogs, {
  foreignKey: "projectId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  as: "devlogs",
});

blogs.belongsTo(projects, {
  foreignKey: "projectId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  as: "projectDetails",
});

// Bookmarks

users.hasMany(bookmarks, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "bookmarks",
});

bookmarks.belongsTo(users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "user",
});

bookmarks.belongsTo(blogs, {
  foreignKey: "blogId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "blog",
});

bookmarks.belongsTo(projects, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "project",
});

blogs.hasMany(bookmarks, {
  foreignKey: "blogId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "bookmarks",
});

projects.hasMany(bookmarks, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "bookmarks",
});

// Comments

users.hasMany(comments, {
  foreignKey: "authorId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "comments",
});

comments.belongsTo(users, {
  foreignKey: "authorId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "authorDetails",
});

blogs.hasMany(comments, {
  foreignKey: "blogId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "comments",
});

comments.belongsTo(blogs, {
  foreignKey: "blogId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "blog",
});

projects.hasMany(comments, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "comments",
});

comments.belongsTo(projects, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "project",
});

comments.hasMany(comments, {
  foreignKey: "parentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "replies",
});

comments.belongsTo(comments, {
  foreignKey: "parentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "parent",
});

