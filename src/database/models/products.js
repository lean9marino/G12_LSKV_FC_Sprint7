'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Products.belongsTo(models.Categories,{
        foreignKey:'idCategory',
        as:'category'
      }),
      Products.belongsTo(models.Styles,{
        as: "Styles", 
        foreignKey: "idStyle" 
       }),
       Products.belongsTo(models.Visibility,{
        as: "Visibility", 
        foreignKey: "idVisibility" 
       }),
       Products.belongsTo(models.Stars,{
        as: "Stars", 
        foreignKey: "idStar" 
       }),
       Products.hasMany(models.Image_product,{
        as: "ImageProduct", 
        foreignKey: "idproducts" 
       }),
       Products.belongsToMany(models.Sizes,{
         as: 'Sizes',
         through:'sizes_product',
         foreignKey:'product_id',
         otherKey:'size_id',
         timestamps:false
       }),
       Products.belongsToMany(models.Colours,{
        as: 'Colours',
        through:'colours_product',
        foreignKey:'product_id',
        otherKey:'colour_id',
        timestamps:false
      })
    }
  }
  Products.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    idCategory: DataTypes.INTEGER,
    idStyle: DataTypes.INTEGER,
    idVisibility: DataTypes.INTEGER,
    idStar: DataTypes.INTEGER,
    discount: DataTypes.DECIMAL,
    shipping: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};