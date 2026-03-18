import pool from '../config/db.config.js';
import { BadRequestError } from '../utils/errors.utils.js';

export const addPoojaToFavoritesModel = async (userId, poojaId) => {
  const [result] = await pool.execute(
    `INSERT INTO user_favourite_poojas (user_id, pooja_id) 
     VALUES (?, ?)`,
    [userId, poojaId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to add pooja to favorites");
  }

  return true;
};

export const checkPjoojaExistsInFavoritesModel = async (userId, poojaId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM user_favourite_poojas 
     WHERE user_id = ? AND pooja_id = ?`,
    [userId, poojaId]
  );

  return rows.length > 0; // Returns true if pooja exists in user's favourites, false otherwise
};

export const getUserFavouritePoojasModel = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT p.id, p.pooja_key, p.pooja_name, p.pooja_description, 
            p.price, p.currency, p.duration_in_hours
     FROM user_favourite_poojas uf
     JOIN pooja p ON uf.pooja_id = p.id
     WHERE uf.user_id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    return []; // No favourite poojas found for the user
  }

  return rows; // Return all favourite poojas found for the user
};

export const getUserFavouriteTemplesModel = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT t.id, t.temple_key, t.temple_name, t.temple_description, 
            t.location
     FROM user_favourite_temples uf
     JOIN temples t ON uf.temple_id = t.id
     WHERE uf.user_id = ?`,
    [userId]
  );

  if (rows.length === 0) {
    return []; // No favourite temples found for the user
  }

  return rows; // Return all favourite temples found for the user
};

export const addTempleToFavoritesModel = async (userId, templeId) => {
  const [result] = await pool.execute(
    `INSERT INTO user_favourite_temples (user_id, temple_id) 
     VALUES (?, ?)`,
    [userId, templeId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to add temple to favorites");
  }

  return true;
};

export const checkTempleExistsInFavoritesModel = async (userId, templeId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM user_favourite_temples 
     WHERE user_id = ? AND temple_id = ?`,
    [userId, templeId]
  );

  return rows.length > 0; // Returns true if temple exists in user's favourites, false otherwise
};

export const checkTempleIdExistsModel = async (templeId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM temples 
     WHERE id = ?`,
    [templeId]
  );

  return rows.length > 0; // Returns true if temple exists, false otherwise
};

export const checkPoojaIdExistsModel = async (poojaId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM pooja 
     WHERE id = ?`,
    [poojaId]
  );

  return rows.length > 0; // Returns true if pooja exists, false otherwise
};

export const removePoojaFromFavoritesModel = async (userId, poojaId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_favourite_poojas 
     WHERE user_id = ? AND pooja_id = ?`,
    [userId, poojaId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to remove pooja from favorites");
  }

  return true;
};
export const removeTempleFromFavoritesModel = async (userId, templeId) => {
  const [result] = await pool.execute(
    `DELETE FROM user_favourite_temples 
     WHERE user_id = ? AND temple_id = ?`,
    [userId, templeId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to remove temple from favorites");
  }

  return true;
};
