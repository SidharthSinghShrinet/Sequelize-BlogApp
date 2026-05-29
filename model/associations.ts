import users from "./user.model";
import blogs from "./blog.model";

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
