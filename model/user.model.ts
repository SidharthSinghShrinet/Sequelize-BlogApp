import { DataTypes } from "sequelize";
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
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 20], // Only allow values between 6 and 20 characters in length
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [10, 10], // Only allow values whose length is exactly 10 characters
    },
  },
  isActive:{
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

// Password hashing (with in built Bunjs) before saving the user to the database
// The Bun.password.hash() function provides a fast, built-in mechanism for securely hashing passwords in Bun. No third-party dependencies are required.
const hashPassword = async (user: any) => {
  if (user.changed("password")) {
    user.password = await Bun.password.hash(user.password);
  }
};

users.beforeCreate(hashPassword);
users.beforeUpdate(hashPassword);

export default users;
