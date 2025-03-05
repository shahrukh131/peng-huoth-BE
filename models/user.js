'use strict';
const {
  Model
} = require('sequelize');
const CoreModel = require('./coreModel');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    ...CoreModel(DataTypes),
    staff_id: DataTypes.STRING,
    staff_name: DataTypes.STRING,
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: {
        args: true,
        msg: 'The Email must be unique.', // Custom error message
      },
      validate: {
        notNull: {
          msg: 'Please enter your email'
        },
        isUnique: async function (value) {
          const user = await User.findOne({ where: { email: value } });
          if (user) {
            throw new Error('The Email is already used.'); // Custom error message
          }
        },
      }
    },
    password: DataTypes.STRING,
    phoneNumber: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: {
        args: true,
        msg: 'The Phone Number must be unique.', // Custom error message
      },
      validate: {
        notNull: {
          msg: 'Please enter your phoneNumber'
        },
        isUnique: async function (value) {
          const user = await User.findOne({ where: { phoneNumber: value } });
          if (user) {
            throw new Error('The phoneNumber is already used.'); // Custom error message
          }
        },
      }
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPhoneVerfied: DataTypes.BOOLEAN,
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return User;
};