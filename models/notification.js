"use strict";
const { Model } = require("sequelize");
const CoreModel = require("./coreModel");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Notification.belongsTo(models.Lead, {
        foreignKey: "lead_id",
      });
    }
  }
  Notification.init(
    {
      ...CoreModel(DataTypes),
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Notification;
};
