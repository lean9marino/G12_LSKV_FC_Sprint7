'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Colours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Colours.belongsToMany(models.Products,{
        as: 'Products',
        through:'colours_product',
        foreignKey:'colour_id',
        otherKey:'product_id',
        timestamps:false
      })
    }
  }
  Colours.init({
    name: DataTypes.STRING,
    urlColour: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Colours',
    timestamps:false
  });
  return Colours;
};