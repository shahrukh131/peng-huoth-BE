'use strict';
const {
  Model
} = require('sequelize');
const CoreModel = require('./coreModel');
module.exports = (sequelize, DataTypes) => {
  class LeadStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LeadStatus.hasMany(models.Lead, {
        foreignKey: 'leadStatus_id',
      });
    }
  }
  LeadStatus.init({
    ...CoreModel(DataTypes),
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: {
        args: true,
        msg: 'Lead Status already exists'
      }
    },
    description: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'LeadStatus',
    createdAt: "created_at",
    tableName: 'LeadStatuses',
    updatedAt: "updated_at",
  });
  return LeadStatus;
};