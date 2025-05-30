import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  let databaseName = null;
  let databaseUserName = null;
  let databaseVersionValue = null;
  let databaseOpenedConnectionsValue = null;
  let databaseMaxConnectionsValue = null;

  //Try do databaseVersionResult
  try {
    const databaseVersionResult = await database.query("SELECT version();");
    const fullVersion =
      databaseVersionResult?.rows?.[0]?.version || "desconhecido";

    // Extrai apenas o número da versão, ex: "15.8"
    const match = fullVersion.match(/PostgreSQL (\d+\.\d+)/);
    databaseVersionValue = match ? match[1] : "desconhecido";
  } catch (error) {
    console.error("Erro ao obter versão do banco:", error);
  }

  //Try do max_connections
  try {
    const result = await database.query("SHOW max_connections;");
    databaseMaxConnectionsValue = parseInt(
      result?.rows?.[0]?.max_connections || 0,
    );
  } catch (error) {
    console.error("Erro ao obter max_connections:", error);
  }

  //Try do opened_connections
  try {
    databaseName = process.env.POSTGRES_DB;
    const result = await database.query({
      text: "SELECT count(*) from pg_stat_activity WHERE datname = $1",
      values: [databaseName],
    });

    databaseOpenedConnectionsValue = parseInt(result?.rows?.[0]?.count || 0);
  } catch (error) {
    console.error("Erro ao contar conexões abertas:", error);
  }

  try {
    const databaseUserResult = await database.query("SELECT current_user;");
    databaseUserName = databaseUserResult.rows[0].current_user;
  } catch (error) {
    console.error("Erro ao pegar nome de usuário do banco:", error);
  }

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        username: databaseUserName,
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
