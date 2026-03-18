import pool from "../../config/db.config.js";

export const createBankModel = async (bank_name, bank_code) => {
  const query = "INSERT INTO banks (bank_name, bank_code) VALUES (?, ?)";
  const values = [bank_name, bank_code];
  const [result] = await pool.query(query, values);
  return {
    id: result.insertId,
    bank_name,
    bank_code,
  };
};

export const getAllBanksModel = async () => {
  const query = "SELECT * FROM banks";
  const [rows] = await pool.query(query);
  return rows;
};

export const deleteBankByIdModel = async (id) => {
  const query = "DELETE FROM banks WHERE id = ?";
  const values = [id];
  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};
