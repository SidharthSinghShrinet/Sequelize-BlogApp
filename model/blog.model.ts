import {type DataType, DataTypes} from "sequelize";
import sequelize from "../config/db.ts";

const blog = sequelize.define("blog",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    content:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    author:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:"users",
            key: 'id'
        }
    },
    createdAt:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},{
    tableName: "blogs",
    timestamps: true,
    underscored: true,
})

export default blog;