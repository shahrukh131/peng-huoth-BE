'use strict';
const {
  Model
} = require('sequelize');
const CoreModel = require('./coreModel');
module.exports = (sequelize, DataTypes) => {
  class BusinessUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BusinessUnit.hasMany(models.Lead, {
        foreignKey: 'business_unit_id',
      });
    }
  }
  BusinessUnit.init({
    ...CoreModel(DataTypes),
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: {
        args: true,
        msg: 'Business Unit already exists'
      }
    },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BusinessUnit',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return BusinessUnit;
};