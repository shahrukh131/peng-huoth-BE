function CoreModel(DataTypes) {
    return {
      created_by_email: {
        type: DataTypes.STRING,
      },
      created_by_dn: {
        type: DataTypes.STRING,
      },
      updated_by_email: {
        type: DataTypes.STRING,
      },
      updated_by_dn: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        defaultValue: new Date(),
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    };
  }
  module.exports = CoreModel;
  