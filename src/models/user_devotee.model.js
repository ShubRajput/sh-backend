import pool from "../config/db.config.js";

export const creatUserDevoteeModel = async (userId, devoteeData) => {
  const { devotee_name, date_of_birth, gotra } = devoteeData;

  // Insert new devotee into the database
  const [result] = await pool.execute(
    "INSERT INTO user_devotees (user_id, devotee_name, date_of_birth, gotra) VALUES (?, ?, ?, ?)",
    [userId, devotee_name, date_of_birth, gotra]
  );
  return {
    id: result.insertId,
    user_id: userId,
    devotee_name,
    date_of_birth,
    gotra,
  };
};

export const getUserAllDevoteesByUserIdModel = async (userId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM user_devotees WHERE user_id = ?",
    [userId]
  );

  if (rows.length === 0) {
    return []; // No devotees found for the given user
  }

  return rows; // Return all devotees found for the user
};

export const deleteUserDevoteeByIdModel = async (userId, devoteeId) => {
  const [result] = await pool.execute(
    "DELETE FROM user_devotees WHERE id = ? AND user_id = ?",
    [devoteeId, userId]
  );

  if (result.affectedRows === 0) {
    return false; // No rows deleted, either devotee not found or not owned by user
  }

  return true; // Return true if deletion was successful
};

export const updateUserDevoteeByIdModel = async (
  userId,
  devoteeId,
  devoteeData
) => {
  const { devotee_name, date_of_birth, gotra } = devoteeData;
  const [result] = await pool.execute(
    `UPDATE user_devotees 
         SET devotee_name = ?, date_of_birth = ?, gotra = ? 
         WHERE id = ? AND user_id = ?`,
    [devotee_name, date_of_birth, gotra, devoteeId, userId]
  );
  if (result.affectedRows === 0) {
    return false; // No rows updated, either devotee not found or not owned by user
  }
  return {
    id: devoteeId,
    user_id: userId,
    devotee_name,
    date_of_birth,
    gotra,
  };
};
