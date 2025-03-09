'use strict';
const {
  Model
} = require('sequelize');
const CoreModel = require('./coreModel');
const { ref } = require('joi');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lead.belongsTo(models.BusinessUnit, {
        foreignKey: 'businessUnit_id',
      });
      Lead.belongsTo(models.LeadStatus, {
        foreignKey: 'leadStatus_id',
      });
      Lead.belongsTo(models.Occupation, {
        foreignKey: 'occupation_id',
      });
      Lead.belongsTo(models.User, {
        foreignKey: 'created_by_user_id',
        as: 'createdLeads'
      });
    }
  }
  Lead.init({
    ...CoreModel(DataTypes),
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    },
    businessUnit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BusinessUnits',
        key: 'id',
      },
    },
    leadStatus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'LeadStatuses',
        key: 'id',
    },
    occupation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Occupations',
        key: 'id',
      },
    },
    created_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    ...CoreModel(DataTypes),
  }}, {
    sequelize,
    modelName: 'Lead',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Lead;
};