import {type DataType, DataTypes} from "sequelize";
import sequelize from "../config/db.ts";

const users = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 20] // Only allow values between 6 and 20 characters in length
        }
    },
    phoneNumber:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [10,10] // Only allow values whose length is exactly 10 characters
        }
    }
})

export default users;