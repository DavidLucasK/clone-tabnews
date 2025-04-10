const { Pool } = require("pg");

const pool = new Pool({
  host: "db.pfuiuogdvtfuosrqyohp.supabase.co",
  port: 5432,
  user: "postgres",
  password: "SUA_SENHA_AQUI",
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ Conectado com sucesso ao banco:", res.rows[0]);
    pool.end();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco:", err);
  });
