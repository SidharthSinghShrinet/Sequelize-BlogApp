import users from "./user.model";
import blogs from "./blog.model";
import projects from "./project.model";

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
