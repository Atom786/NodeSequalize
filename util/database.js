// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'nodeproduct',
//     password: 'Ravi@786'
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("nodecomplete", "root", "Ravi@786", {dialect: "mysql", host: "localhost"});

module.exports = sequelize;