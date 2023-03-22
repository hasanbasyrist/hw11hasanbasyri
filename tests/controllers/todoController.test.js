const request = require('supertest');
const app = require('../app');
const { Todo } = require('../models');

describe('Todo Controller', () => {
  beforeAll(async () => {
    await Todo.destroy({ where: {} });
  });

  describe('GET /todos', () => {
    it('should return empty array', async () => {
      const response = await request(app).get('/todos');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'Buy groceries' };
      const response = await request(app).post('/todos').send(newTodo);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Buy groceries');
    });
  });

  describe('GET /todos/:id', () => {
    let todo;

    beforeAll(async () => {
      todo = await Todo.findOne({ where: { title: 'Buy groceries' } });
    });

    it('should return the todo with the specified id', async () => {
      const response = await request(app).get(`/todos/${todo.id}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Buy groceries');
    });

    it('should return 404 if the todo is not found', async () => {
      const response = await request(app).get('/todos/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('DELETE /todos/:id', () => {
    let todo;

    beforeAll(async () => {
      todo = await Todo.findOne({ where: { title: 'Buy groceries' } });
    });

    it('should soft delete the todo with the specified id', async () => {
      const response = await request(app).delete(`/todos/${todo.id}`);
      expect(response.status).toBe(204);
      const deletedTodo = await Todo.findOne({ where: { id: todo.id } });
      expect(deletedTodo).toBeNull();
      const allTodos = await Todo.findAll({ paranoid: false });
      expect(allTodos.length).toBe(1);
    });

    it('should return 404 if the todo is not found', async () => {
      const response = await request(app).delete('/todos/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });
  });
});
