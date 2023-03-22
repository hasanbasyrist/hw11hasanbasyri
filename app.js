const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Todo = require('./models/Todo');
const { sequelize } = require('./config/database');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/todos', todoRoutes);

// Database Connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return Todo.sequelize.sync();
  })
  .then(() => {
    console.log('Database sync completed.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
  app.listen(3000, () => console.log('Server running on port 3000...'));
module.exports = app;

