import mysql from "mysql2/promise";

let pool: mysql.Pool;

export const connDB = async (): Promise<mysql.Pool> => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: {
          ca: process.env.DB_CA_CERT?.replace(/\\n/g, "\n"),
        },
      });
      console.log("MySQL Connected!");
    }
    return pool;

  } catch (error: any) {

    console.error("Error connecting to MySQL:", error.message);
    process.exit(1);

  }
};

export const getDB = (): mysql.Pool => {
  if (!pool) {
    throw new Error("Database not connected. Call connDB() first.");
  }

  return pool;
}