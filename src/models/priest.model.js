import bcrypt from "bcryptjs";

import pool from "../config/db.config.js";
import { BadRequestError, UnauthorizedError } from "../utils/errors.utils.js";

export const createPriestModel = async (
  userId,
  religion,
  religion_id,
  phone_number,
  temple_id
) => {
  const [existing] = await pool.execute(
    "SELECT user_id FROM priests WHERE user_id = ?",
    [userId]
  );
  if (existing.length > 0) {
    throw new BadRequestError("User is already a priest.");
  }

  const [users] = await pool.execute("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);
  if (users.length === 0) {
    throw new BadRequestError("User not found.");
  }

  const [existingPhoneNumberUser] = await pool.execute(
    "SELECT * FROM users WHERE phone_number = ?",
    [phone_number]
  );

  if (
    existingPhoneNumberUser.length > 0 &&
    existingPhoneNumberUser[0].id !== userId
  ) {
    throw new BadRequestError(
      "Phone number is already in use by another user."
    );
  }

  try {
    const [updatedPhoneNumberResult] = await pool.execute(
      "UPDATE users SET phone_number = ? WHERE id = ?",
      [phone_number, userId]
    );
    if (updatedPhoneNumberResult.affectedRows === 0) {
      throw new BadRequestError("Failed to become a priest.");
    }
  } catch (error) {
    throw new BadRequestError("Failed to become a priest.");
  }

  const [result] = await pool.execute(
    `INSERT INTO priests (user_id, religion, religion_id, temple_id)
        VALUES (?, ?, ?, ?)`,
    [userId, religion, religion_id, temple_id || null]
  );

  return result.insertId;
};

export const findUserByEmailModel = async (email, password) => {
  const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  return user;
};

export const findPriestByUserIdModel = async (userId) => {
  const [priests] = await pool.execute(
    "SELECT * FROM priests WHERE user_id = ?",
    [userId]
  );

  if (priests.length === 0) {
    throw new UnauthorizedError("This user is not a registered priest.");
  }

  return priests[0];
};

export const uploadPriestProfileImageModel = async (
  userId,
  profileImageUrl
) => {
  const [result] = await pool.execute(
    "UPDATE users SET profile_image_url = ? WHERE id = ?",
    [profileImageUrl, userId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to update profile picture.");
  }

  return result;
};

export const checkIsUserPriestModel = async (userId) => {
  const [priests] = await pool.execute(
    "SELECT * FROM priests WHERE user_id = ?",
    [userId]
  );

  return priests.length > 0;
};

export const addPriestIntroductionModel = async (userId, introduction) => {
  const [result] = await pool.execute(
    `UPDATE priests SET introduction = ? WHERE user_id = ?`,
    [introduction, userId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("User not found or no changes made");
  }
  return { userId, introduction };
};

export const getExistingPriestDetailsModel = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        u.id,
        u.user_name,
        u.email,
        u.date_of_birth,
        u.nationality,
        p.priest_location AS location,
        p.temple_id,
        u.is_email_verified,
        u.profile_image_url,
        p.introduction,
        p.religion,
        p.religion_id
     FROM users AS u JOIN priests AS p ON u.id = p.user_id
    WHERE u.id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const updatePriestProfileDetailsModel = async (userId, userDetails) => {
  const {
    user_name,
    date_of_birth,
    temple_id,
    nationality,
    religion,
    introduction,
    religion_id,
  } = userDetails;

  const [result] = await pool.execute(
    `UPDATE users 
     SET user_name = ?, date_of_birth = ?, nationality = ?
     WHERE id = ?`,
    [user_name, date_of_birth || null, nationality || null, userId]
  );

  const [result2] = await pool.execute(
    `UPDATE priests
    SET religion = ?, introduction = ?, temple_id = ?, religion_id = ?
    WHERE user_id = ?`,
    [religion, introduction || null, temple_id || null, religion_id, userId]
  );

  if (result.affectedRows === 0 || result2.affectedRows === 0) {
    throw new BadRequestError("User not found or no changes made");
  }
  return {
    userId,
    user_name,
    date_of_birth,
    temple_id,
    nationality,
    religion,
    introduction,
  };
};
