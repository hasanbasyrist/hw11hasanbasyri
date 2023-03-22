const Sequelize = require('sequelize');

const sequelize = new Sequelize("database_todo", "postgres", "mengingatMU513", {
  host: 'localhost',
  dialect: 'postgresql',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
