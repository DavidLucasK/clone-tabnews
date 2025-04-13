import retry from "async-retry";

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

export default {
  waitForAllServices,
};
