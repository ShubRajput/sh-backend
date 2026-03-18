import pool from "../../config/db.config.js";

export const adminSignUpModel = async (adminData) => {
  const { user_name, email, password } = adminData;
  const [result] = await pool.execute(
    `INSERT INTO system_users (user_name, email, password) VALUES (?, ?, ?)`,
    [user_name, email, password]
  );

  //Assign Admin Role
  const [roleResult] = await pool.execute(
    `INSERT INTO system_user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = 'admin' ON DUPLICATE KEY UPDATE role_id = role_id`,
    [result.insertId]
  );
  if (result.affectedRows === 0) {
    throw new BadRequestError("Admin signup failed");
  }
  return {
    id: result.insertId,
    user_name,
    email,
  };
};

export const getExistAdminDetailsByEmailModel = async (email) => {
  // Fetch admin details and role details by email
  const [rows] = await pool.execute(
    `
    SELECT u.*, GROUP_CONCAT(r.name) AS roles
    FROM system_users u
    JOIN system_user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE u.email = ?
    GROUP BY u.id
    `,
    [email]
  );
  if (rows.length === 0) {
    return null; // No admin found with the given email
  }
  return rows[0]; // Return the first admin found
};

export const getAdminByIdModel = async (adminId) => {
  const [rows] = await pool.execute(`SELECT * FROM system_users WHERE id = ?`, [
    adminId,
  ]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

export const updateAdminPasswordModel = async (adminId, hashedPassword) => {
  const [result] = await pool.execute(
    `UPDATE system_users SET password = ? WHERE id = ?`,
    [hashedPassword, adminId]
  );
  return result.affectedRows > 0;
};

export const saveSystemUserRefreshTokenModel = async (
  adminId,
  refreshToken,
  expiresIn
) => {
  const query = `
    INSERT INTO system_users_refresh_tokens (system_user_id, refresh_token, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
    ON DUPLICATE KEY UPDATE refresh_token = ?, expires_at = DATE_ADD(NOW(), INTERVAL ? DAY)
  `;
  const [result] = await pool.execute(query, [
    adminId,
    refreshToken,
    expiresIn,
    refreshToken,
    expiresIn,
  ]);
  return result.affectedRows > 0;
};

export const deleteSystemUserRefreshTokenModel = async (
  adminId,
  refreshToken
) => {
  const query = `
    DELETE FROM system_users_refresh_tokens
    WHERE system_user_id = ? AND refresh_token = ?
  `;
  const [result] = await pool.execute(query, [adminId, refreshToken]);
  return result.affectedRows > 0;
};

export const getAdminRefreshTokenModel = async (adminId, refreshToken) => {
  const query = `
    SELECT * FROM system_users_refresh_tokens
    WHERE system_user_id = ? AND refresh_token = ? AND expires_at > NOW()
  `;
  const [rows] = await pool.execute(query, [adminId, refreshToken]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};
