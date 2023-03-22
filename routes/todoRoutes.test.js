const request = require("supertest");
const app = require("../app");
const { Todo } = require("../models/todo.test");
const { sequelize } = require("../models/todo.test");

beforeAll(async () => {
  await sequelize.sync();
});

afterEach(async () => {
  await Todo.destroy({ where: {} });
});

describe("Todo Routes", () => {
  describe("GET /todos", () => {
    it("should return list of todos", async () => {
      await Todo.create({ title: "Todo 1" });
      await Todo.create({ title: "Todo 2" });

      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe("Todo 1");
      expect(response.body[1].title).toBe("Todo 2");
    });
  });

  describe("GET /todos/:id", () => {
    it("should return single todo with correct id", async () => {
      const todo = await Todo.create({ title: "Todo 1" });

      const response = await request(app).get(`/todos/${todo.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Todo 1");
    });

    it("should return 404 for non-existent todo", async () => {
      const response = await request(app).get("/todos/999");

      expect(response.status).toBe(404);
    });
  });

  describe("POST /todos", () => {
    it("should create new todo", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "New Todo" });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("New Todo");

      const createdTodo = await Todo.findOne({ where: { id: response.body.id } });
      expect(createdTodo.title).toBe("New Todo");
    });

    it("should return 400 for missing title", async () => {
      const response = await request(app).post("/todos");

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should soft delete todo with correct id", async () => {
      const todo = await Todo.create({ title: "Todo 1" });

      const response = await request(app).delete(`/todos/${todo.id}`);

      expect(response.status).toBe(204);

      const deletedTodo = await Todo.findOne({
        where: { id: todo.id },
        paranoid: false,
      });
      expect(deletedTodo.deletedAt).toBeTruthy();
    });

    it("should return 404 for non-existent todo", async () => {
      const response = await request(app).delete("/todos/999");

      expect(response.status).toBe(404);
    });
  });
});
