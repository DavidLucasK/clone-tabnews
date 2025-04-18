import retry from "async-retry";
import database from "infra/database";

const webServerUrl = "http://localhost:3000";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch(`${webServerUrl}/api/v1/status`);

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query(
    "drop schema if exists public cascade; create schema public;",
  );
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
