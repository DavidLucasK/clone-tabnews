import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  //Retornar a data corretamente
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(Date.parse(responseBody.updated_at)).not.toEqual(NaN);

  expect(responseBody.dependencies.database.version).toEqual("16.9");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);

  //Não conter senha ou email no corpo da resposta
  expect(responseBody).not.toHaveProperty("password");
  expect(responseBody).not.toHaveProperty("email");
});
