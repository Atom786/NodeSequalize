const Sequelize = require("sequelize");
// const { SequelizeMethod } = require("sequelize/types/utils");
const sequelize = require('../util/database');

const Product = sequelize.define("product",{
  id: {
    type : Sequelize.INTEGER,
    autoIncrement :true,
    allowNull : false,
    primaryKey : true
  },
  title:{
    type : Sequelize.STRING,
  },
  price :{
    type : Sequelize.DOUBLE, 
    allowNull : false,
  },
  imageUrl:{
    type : Sequelize.BLOB,
    allowNull : false,
  },
  description :{
    type : Sequelize.STRING,
    allowNull: false,
  }
})

module.exports = Product;





// const Cart = require('./cart');

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//       [this.title, this.price, this.imageUrl, this.description]
//     );
//   }

//   static deleteById(id) {}

//   static fetchAll() {
//     return db.execute('SELECT * FROM products');
//   }

//   static findById(id) {
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//   }
// };




