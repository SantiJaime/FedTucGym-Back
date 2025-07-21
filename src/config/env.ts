import dotenv from 'dotenv';

dotenv.config();

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`La variable de entorno ${key} es requerida y NO está definida`);
  }
  return value!;
}

export const env = {
  PORT: Number(getEnvVariable('PORT', false)) || 3000,
  PGHOST: getEnvVariable('PGHOST'),
  PGPORT: getEnvVariable('PGPORT'),
  PGUSER: getEnvVariable('PGUSER'),
  PGDATABASE: getEnvVariable('PGDATABASE'),
  PGPASSWORD: getEnvVariable('PGPASSWORD'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnvVariable('JWT_REFRESH_SECRET'),
  COOKIE_SECRET: getEnvVariable('COOKIE_SECRET'),
  PGSCHEMA: getEnvVariable('PGSCHEMA'),
  NODE_ENV: getEnvVariable('NODE_ENV'),
  SHEETS_SCRIPT_URL: getEnvVariable('SHEETS_SCRIPT_URL'),
};
