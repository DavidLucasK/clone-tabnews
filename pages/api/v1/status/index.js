import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  let databaseVersionValue = "desconhecido";
  //Feito um regex para pegar somente o valor da version
  // Já que o 'SHOW server_version;' só retorna undefined
  try {
    const databaseVersionResult = await database.query("SELECT version();");
    const versionText =
      databaseVersionResult?.rows?.[0]?.version || "desconhecido";
    databaseVersionValue = versionText.split(" ")[1] || "desconhecido";
  } catch (error) {
    console.error("Erro ao obter versão do banco:", error);
  }

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue = parseInt(
    databaseMaxConnectionsResult?.rows?.[0]?.max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*) from pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: parseInt(databaseOpenedConnectionsValue),
      },
      webserver: {
        coisa: "nada por aqui ainda",
        coisa2: "nada por aqui ainda2",
      },
    },
  });
}

export default status;
