'use strict';
const {
  Model
} = require('sequelize');
const CoreModel = require('./coreModel');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     Role.belongsToMany(models.User, {
        through: 'UserRoles',
        foreignKey: 'role_id',
        otherKey: 'user_id',
        as: 'users'
      });
    }
  }
  Role.init({
    ...CoreModel(DataTypes),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'The Role name must be unique.', // Custom error message
      },
      validate: {
        notNull: {
          msg: 'Please enter the role name'
        },
        isUnique: async function (value) {
          const role = await Role.findOne({ where: { name: value } });
          if (role) {
            throw new Error('The Role name is already used.'); // Custom error message
          }
        },
      }
    },
    description: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Role',
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return Role;
};