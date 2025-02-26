function CoreEntity(Sequelize) {
    return {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      created_by_email: {
          type: Sequelize.STRING,
      },
      updated_by_email: {
          type: Sequelize.STRING,
      },
      created_by_dn: {
          type: Sequelize.STRING,
      },
      updated_by_dn: {
          type: Sequelize.STRING,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        allowNull: true,
        defaultValue: new Date(),
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    };
  }
  module.exports = CoreEntity;
  