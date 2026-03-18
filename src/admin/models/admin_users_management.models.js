import pool from "../../config/db.config.js";

export const getAllUsersModel = async () => {
  const [rows] = await pool.execute(`SELECT * FROM users`);
  // Remove sensitive data like passwords before returning
  rows.forEach((user) => {
    delete user.password;
    delete user.reset_password_token;
  });

  return rows;
};

export const updateUserSuspendedStatusModel = async (userId, isSuspended) => {
  const [result] = await pool.execute(
    `UPDATE users SET is_suspended = ? WHERE id = ?`,
    [isSuspended, userId]
  );
  return result;
};

export const getPendingAdminsModel = async () => {
  const [rows] = await pool.execute(
    `SELECT * FROM system_users WHERE is_approved = 0`
  );
  rows.forEach((admin) => {
    delete admin.password;
  });
  return rows;
};

export const approveAdminModel = async (adminId, is_approved) => {
  const [result] = await pool.execute(
    `UPDATE system_users SET is_approved = ? WHERE id = ?`,
    [is_approved, adminId]
  );
  return result.affectedRows > 0;
};
