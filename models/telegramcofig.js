'use strict';
const {
  Model
} = require('sequelize');
const CoreModel = require('./coreModel');
module.exports = (sequelize, DataTypes) => {
  class TelegramConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TelegramConfig.init({
     ...CoreModel(DataTypes),
    bot_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chat_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'TelegramConfig',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return TelegramConfig;
};