const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function main() {
  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "admin123";
  const passwordHash = await bcrypt.hash(password, 12);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "cet_mech_placement"
  });

  await connection.execute(
    "INSERT INTO admins (username, passwordHash) VALUES (?, ?) ON DUPLICATE KEY UPDATE passwordHash = VALUES(passwordHash)",
    [username, passwordHash]
  );
  await connection.end();
  console.log(`Admin ready: ${username}`);
}

main().catch((error) => {
  
  console.error(error);
  process.exit(1);
});
