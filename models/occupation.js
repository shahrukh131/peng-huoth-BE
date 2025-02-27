'use strict';
const {
  Model
} = require('sequelize');
const CoreModel = require('./coreModel');
const sendResponse = require('../utils/sendResponse');
module.exports = (sequelize, DataTypes) => {
  class Occupation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Occupation.init({
    ...CoreModel(DataTypes),
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      unique: {
        args: true,
        msg: 'The Occupation Name must be unique.', // Custom error message
      },
      validate: {
        notNull: {
          msg: 'Please enter occupation Name'
        },
        isUnique: async function (value) {
          const user = await Occupation.findOne({ where: { name: value } });
          if (user) {
            throw new Error('The Occupation Name is already used.'); // Custom error message
            // sendResponse(res, 422, null, error);
          }
        },
      }
    },
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Occupation',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Occupation;
};