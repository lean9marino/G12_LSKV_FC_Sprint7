'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class colours_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      colours_product.belongsTo(models.Products,{
        as:'products', 
        foreignKey: 'id'
      }),
      colours_product.belongsTo(models.Colours,{
        as:'colour', 
        foreignKey: 'id'
      })
    }
  }
  colours_product.init({
    product_id: DataTypes.INTEGER,
    colour_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'colours_product',
    timestamps:false
  });
  return colours_product;
};