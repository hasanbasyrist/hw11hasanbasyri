const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database_todo', 'postgres', 'mengingatMU513', {
  host: 'localhost',
  dialect: 'postgresql',
});

const Todo = sequelize.define('todo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

module.exports = Todo;
