import pool from "../../config/db.config.js";

export const createResetPasswordModel = async (email, encryptedOtp, expiresAt) => {
  const [result] = await pool.execute(
    `INSERT INTO admin_reset_password (email, otp, expires_at) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?, created_at = CURRENT_TIMESTAMP`,
    [email, encryptedOtp, expiresAt, encryptedOtp, expiresAt]
  );
  return result;
};

export const getResetPasswordByEmailModel = async (email) => {
  const [rows] = await pool.execute(
    `SELECT * FROM admin_reset_password WHERE email = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`,
    [email]
  );
  return rows[0] || null;
};

export const deleteResetPasswordModel = async (email) => {
  const [result] = await pool.execute(
    `DELETE FROM admin_reset_password WHERE email = ?`,
    [email]
  );
  return result;
};

export const updateAdminPasswordModel = async (email, hashedPassword) => {
  const [result] = await pool.execute(
    `UPDATE system_users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?`,
    [hashedPassword, email]
  );
  return result;
};