'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cant: {
        type: Sequelize.DOUBLE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stars');
  }
};