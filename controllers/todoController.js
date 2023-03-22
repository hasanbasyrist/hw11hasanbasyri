const Todo = require('../models/todo');

const getAllTodo = async (req, res, next) => {
  try {
    const todos = await Todo.findAll();
    console.log(todos);
    res.status(200).json({
      status: 'success',
      results: todos.length,
      data: {
        todos,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({
        status: 'fail',
        message: 'Todo not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        todo,
      },
    });
  } catch (err) {
    next(err);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const { title } = req.body;
    console.log(req.body, '<<<<<');
    const todo = await Todo.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        todo,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    await Todo.destroy({ where: { id: req.params.id } });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTodo,
  getTodo,
  createTodo,
  deleteTodo,
};
