import { Pool, types } from "pg";
import { env } from "../config/env";

const DATE_OID = 1082;

types.setTypeParser(DATE_OID, (val) => val);

const pool = new Pool({
  host: env.PGHOST,
  port: Number(env.PGPORT),
  user: env.PGUSER,
  password: env.PGPASSWORD,
  database: env.PGDATABASE,
  options: `-c search_path=${env.PGSCHEMA}`,
});

export default pool;
