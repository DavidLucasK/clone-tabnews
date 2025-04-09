import database from "infra/database.js";

async function status(request, response) {
  const result = await database.query("select 1 + 1 as sum;");
  console.log(result.rows);
  response.status(200).json({ chave: "a" });
}

export default status;
