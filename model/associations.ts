import userModel from "./user.model.ts";
import blogModel from "./blog.model.ts";


userModel.hasMany(blogModel,{
    foreignKey:"author",
    onDelete:"CASCADE",
    onUpdate:"CASCADE",
})

blogModel.belongsTo(userModel,{
    foreignKey:"author",
    onDelete:"CASCADE",
    onUpdate:"CASCADE",
})