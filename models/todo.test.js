const request = require('supertest');
const app = require('../app');
const Todo  = require('../models/todo');
const { sequelize } = require('../config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Todo API', () => {
  const todoData = {
    title: 'Example Todo',
  };
  let createdTodo;

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/todos')
        .send(todoData)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(todoData.title);

      createdTodo = await Todo.findByPk(response.body.id);
      expect(createdTodo).toBeTruthy();
      expect(createdTodo.title).toBe(todoData.title);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/todos')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Title is required');
    });
  });

  describe('GET /todos', () => {
    it('should return all todos', async () => {
      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe(todoData.title);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a todo by id', async () => {
      const response = await request(app).get(`/todos/${createdTodo.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(todoData.title);
    });

    it('should return 404 if todo is not found', async () => {
      const response = await request(app).get(`/todos/999`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Todo not found');
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo by id', async () => {
      const response = await request(app).delete(`/todos/${createdTodo.id}`);

      expect(response.status).toBe(204);

      const todo = await Todo.findByPk(createdTodo.id);
      expect(todo).toBeFalsy();
    });

    it('should return 404 if todo is not found', async () => {
      const response = await request(app).delete(`/todos/999`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Todo not found');
    });
  });
});
