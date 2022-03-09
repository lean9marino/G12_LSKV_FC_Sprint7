'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Image_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      urlName: {
        type: Sequelize.STRING
      },
      idproducts: {
        type: Sequelize.INTEGER
      },
      order:{
        type: Sequelize.INTEGER
      },
      idColour: { 
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Image_products');
  }
};