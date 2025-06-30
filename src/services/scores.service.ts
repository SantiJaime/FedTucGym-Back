import pool from "../database/db.config";

export async function registrarPuntaje(id_member: number, id_tournament: number, puntaje: number) {
  await pool.query(
    "INSERT INTO puntajes (id_member, id_tournament, puntaje) VALUES ($1, $2, $3)",
    [id_member, id_tournament, puntaje]
  );
}

export async function getAllPuntajes() {
  const { rows } = await pool.query("SELECT * FROM puntajes ORDER BY puntaje DESC");
  return rows;
}