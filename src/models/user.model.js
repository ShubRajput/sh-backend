import pool from "../config/db.config.js";
import { BadRequestError } from "../utils/errors.utils.js";

export const userSignUpModel = async (userData) => {
  const { user_name, email, password } = userData;

  // Check if the user already exists
  const [existingUser] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (existingUser.length > 0) {
    throw new BadRequestError("User already exists");
  }

  // Insert new user into the database
  const [result] = await pool.execute(
    "INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)",
    [user_name, email, password]
  );

  return { id: result.insertId, user_name, email };
};

export const getExistingUserDetailsByEmailModel = async (email) => {
  // const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
  //   email,
  // ]);

  const [rows] = await pool.execute(
    `
    SELECT u.*, GROUP_CONCAT(r.name) AS roles, pr.temple_id
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    LEFT JOIN priests pr ON u.id = pr.user_id
    WHERE u.email = ?
    GROUP BY u.id
  `,
    [email]
  );

  if (rows.length === 0) {
    return null; // No user found with the given email
  }

  return rows[0]; // Return the first user found
};

export const getExistingUserDetailsModel = async (userId) => {
  const [rows] = await pool.execute(
    "SELECT id,user_name,email,date_of_birth,maritial_state,nationality,gotra,location,phone_number,is_email_verified,temple_location,profile_image_url FROM users WHERE id = ?",
    [userId]
  );

  if (rows.length === 0) {
    return null; // No user found with the given email
  }

  return rows[0]; // Return the first user found
};

export const updateUserProfileDetailsModel = async (userId, userDetails) => {
  const {
    user_name,
    date_of_birth,
    maritial_state,
    location,
    nationality,
    gotra,
    phone_number,
    temple_location,
    temple_id,
  } = userDetails;

  const [result] = await pool.execute(
    `UPDATE users 
     SET user_name = ?, date_of_birth = ?, maritial_state = ?, location = ?, nationality = ?, gotra = ?, phone_number = ?, temple_location = ?
     WHERE id = ?`,
    [
      user_name,
      date_of_birth || null,
      maritial_state || null,
      location || null,
      nationality || null,
      gotra || null,
      phone_number || null,
      temple_location || null,
      userId,
    ]
  );

  if (temple_id) {
    await pool.execute(
      `UPDATE priests SET temple_id = ? WHERE user_id = ?`,
      [temple_id, userId]
    );
  }

  if (result.affectedRows === 0 && !temple_id) {
    throw new BadRequestError("User not found or no changes made");
  }

  return {
    userId,
    user_name,
    date_of_birth,
    maritial_state,
    location,
    nationality,
    gotra,
    phone_number,
    temple_location,
    temple_id,
  };
};

export const updateUserPhoneNumberModel = async (userId, phone_number) => {
  const [result] = await pool.execute(
    `UPDATE users 
     SET phone_number = ?
     WHERE id = ?`,
    [phone_number, userId]
  );
  if (result.affectedRows === 0) {
    throw new BadRequestError("User not found or no changes made");
  }
  return {
    userId,
    phone_number,
  };
};

export const checkUserExistsBillingAddressModel = async (userId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM user_billing_address WHERE user_id = ?",
    [userId]
  );

  return rows.length > 0; // Returns true if billing address exists, false otherwise
};

export const addUserBillingAddressModel = async (userId, billingAddress) => {
  const {
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    phone_number,
  } = billingAddress;

  const [result] = await pool.execute(
    `INSERT INTO user_billing_address (user_id, address_line1, address_line2, city, state, postal_code, country, phone_number)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      address_line1,
      address_line2 || null,
      city,
      state,
      postal_code,
      country,
      phone_number || null,
    ]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to add billing address");
  }

  return {
    id: result.insertId,
    userId,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    phone_number,
  };
};

export const getUserBillingAddressModel = async (userId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM user_billing_address WHERE user_id = ?",
    [userId]
  );

  if (rows.length === 0) {
    return null; // No billing address found for the user
  }

  return rows[0]; // Return the first billing address found
};

export const saveResetTokenModel = async (userId, token) => {
  const [result] = await pool.execute(
    `UPDATE users 
     SET reset_password_token = ?
     WHERE id = ?`,
    [token, userId]
  );
  if (result.affectedRows === 0) {
    throw new BadRequestError("User not found");
  }
  return {
    userId,
    token,
  };
};

export const updateNewUserPasswordModel = async (userId, newPassword) => {
  const [result] = await pool.execute(
    `UPDATE users 
     SET password = ?,
     reset_password_token = NULL
     WHERE id = ?`,
    [newPassword, userId]
  );
  if (result.affectedRows === 0) {
    throw new BadRequestError("User not found or no changes made");
  }
  return {
    userId,
    newPassword,
  };
};

export const findValidTokenModel = async (token, email) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE reset_password_token = ? AND email = ?",
    [token, email]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const assignUserRoleModel = async (userId) => {
  const [result] = await pool.execute(
    `INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = 'user'
     ON DUPLICATE KEY UPDATE role_id = (SELECT id FROM roles WHERE name = 'user')`,
    [userId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to assign role to user");
  }

  return;
};

export const assignUserToPreistModel = async (userId) => {
  const [result] = await pool.execute(
    `INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = 'priest'
     ON DUPLICATE KEY UPDATE role_id = (SELECT id FROM roles WHERE name = 'priest')`,
    [userId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to assign role to priest");
  }

  return;
};

export const assignUserToVolunteerModel = async (userId) => {
  const [result] = await pool.execute(
    `INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = 'volunteer'
     ON DUPLICATE KEY UPDATE role_id = (SELECT id FROM roles WHERE name = 'volunteer')`,
    [userId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to assign role to volunteer");
  }

  return;
};

export const uploadUserProfileImageModel = async (userId, profileImageUrl) => {
  const [result] = await pool.execute(
    "UPDATE users SET profile_image_url = ? WHERE id = ?",
    [profileImageUrl, userId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to update profile picture.");
  }

  return result;
};

export const changePasswordModel = async (userId, newPassword) => {
  const [result] = await pool.execute(
    `UPDATE users 
     SET password = ?
     WHERE id = ? `,
    [newPassword, userId]
  );
  if (result.affectedRows === 0) {
    throw new BadRequestError("User not found or no changes made");
  }
  return {
    userId,
    newPassword,
  };
};

export const saveUserRefreshTokenModel = async (
  userId,
  refreshToken,
  expiresIn
) => {
  const query = `
  INSERT INTO users_refresh_tokens (
  user_id, 
  refresh_token, 
  expires_at
  ) 
  VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
  ON DUPLICATE KEY UPDATE refresh_token = ?, expires_at = DATE_ADD(NOW(), INTERVAL ? DAY)
 
  `;
  const [result] = await pool.execute(query, [
    userId,
    refreshToken,
    expiresIn,
    refreshToken,
    expiresIn,
  ]);

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to save refresh token");
  }

  return {
    userId,
    refreshToken,
    expiresIn,
  };
};

export const saveUserEmailVerificationTokenModel = async (
  userId,
  emailVerificationToken,
  expiresIn
) => {
  const query = `
  INSERT INTO user_email_verification_tokens (
  user_id, 
  token, 
  expires_at
  ) 
  VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
  ON DUPLICATE KEY UPDATE token = ?, expires_at = DATE_ADD(NOW(), INTERVAL ? DAY)

  `;
  const [result] = await pool.execute(query, [
    userId,
    emailVerificationToken,
    expiresIn,
    emailVerificationToken,
    expiresIn,
  ]);

  return {
    userId,
    emailVerificationToken,
    expiresIn,
  };
};

export const getUserEmailVerificationTokenModel = async (token) => {
  if (!token) {
    return null; // No token provided
  }

  const [rows] = await pool.execute(
    "SELECT * FROM user_email_verification_tokens WHERE token = ? AND expires_at > NOW()",
    [token]
  );

  if (rows.length === 0) {
    return null; // No token found
  }

  return rows[0]; // Return the first token found
};

export const deleteUserEmailVerificationTokenModel = async (token) => {
  const [result] = await pool.execute(
    "DELETE FROM user_email_verification_tokens WHERE token = ?",
    [token]
  );
  return;
};

export const updateUserEmailVerificationStatusModel = async (userId) => {
  const [result] = await pool.execute(
    `UPDATE users 
     SET is_email_verified = 1
     WHERE id = ? `,
    [userId]
  );
};
