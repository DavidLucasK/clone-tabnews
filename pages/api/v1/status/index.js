import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  let databaseVersionValue = "unknown";
  let databaseMaxConnectionsValue = 0;
  let databaseOpenedConnectionsValue = 0;

  try {
    const databaseVersionResult = await database.query("SHOW server_version;");
    databaseVersionValue =
      databaseVersionResult?.rows?.[0]?.server_version || "unknown";
  } catch (error) {
    console.error("Erro ao obter versão do banco:", error);
  }

  try {
    const databaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    databaseMaxConnectionsValue = parseInt(
      databaseMaxConnectionsResult?.rows?.[0]?.max_connections || 0,
    );
  } catch (error) {
    console.error("Erro ao obter max_connections:", error);
  }

  try {
    const databaseName = process.env.POSTGRES_DB;
    const databaseOpenedConnectionsResult = await database.query({
      text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1",
      values: [databaseName],
    });

    databaseOpenedConnectionsValue = parseInt(
      databaseOpenedConnectionsResult?.rows?.[0]?.count || 0,
    );
  } catch (error) {
    console.error("Erro ao contar conexões abertas:", error);
  }

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
      webserver: {
        coisa: "nada por aqui ainda",
        coisa2: "nada por aqui ainda2",
      },
    },
  });
}

export default status;
