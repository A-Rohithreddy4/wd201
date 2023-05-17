/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
const request = require("supertest");
const cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Update a todo with the given ID as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.listDueToday.length;
    const latestTodo = parsedGroupedResponse.listDueToday[dueTodayCount - 1];

    res = await agent.get(`/`);
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        completed: true,
        _csrf: csrfToken,
      });
    const parsedUpdatedResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdatedResponse.completed).toBe(true);
  });

  test("Update a todo with the given ID as incomplete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy meat",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupedTodosResponse1 = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse1 = JSON.parse(groupedTodosResponse1.text);
    const dueTodayCount1 = parsedGroupedResponse1.alltodos.length;
    const latestTodo1 = parsedGroupedResponse1.alltodos[dueTodayCount1 - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo1.id}`)
      .send({
        completed: true,
        _csrf: csrfToken,
      });
    const parsedUpdatedResponse1 = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdatedResponse1.completed).toBe(true);

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.alltodos.length;
    const latestTodo = parsedGroupedResponse.alltodos[dueTodayCount - 1];

    const markIncompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        completed: false,
        _csrf: csrfToken,
      });
    const parsedUpdatedResponse = JSON.parse(markIncompleteResponse.text);
    expect(parsedUpdatedResponse.completed).toBe(false);
  });

  test("Deletes a todo with the given ID ", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);
    const dueTodayCount = parsedResponse.length;
    const currentTodo = parsedResponse[dueTodayCount - 1];
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    const removedResponse = await agent
      .delete(`/todos/${currentTodo.id}`)
      .send({
        _csrf: csrfToken,
      });
    expect(removedResponse.status).toBe(200);
  });
});
