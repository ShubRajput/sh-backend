import pool from "../../config/db.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";

export const createNewPoojaModel = async (poojaData) => {
  const {
    pooja_key,
    pooja_name,
    pooja_description,
    price,
    currency,
    duration_in_hours,
    image_url,
    s3_image_key,
    religion_id,
    is_featured,
  } = poojaData;

  // Check if pooja_key already exists
  const [existingPooja] = await pool.execute(
    "SELECT * FROM pooja WHERE pooja_key = ?",
    [pooja_key]
  );
  if (existingPooja.length > 0) {
    throw new BadRequestError("Pooja with this key already exists");
  }
  // Insert new pooja into the database
  const [result] = await pool.execute(
    "INSERT INTO pooja (pooja_key, pooja_name, pooja_description, price, currency,duration_in_hours,image_url,s3_image_key,religion_id,is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      pooja_key,
      pooja_name,
      pooja_description,
      price,
      currency,
      duration_in_hours,
      image_url,
      s3_image_key,
      religion_id,
      is_featured === "true" ? 1 : 0,
    ]
  );
  return {
    id: result.insertId,
    pooja_key,
    pooja_name,
    pooja_description,
    price,
    currency,
    duration_in_hours,
    image_url,
    s3_image_key,
    religion_id,
    is_featured,
  };
};

export const getAllPoojasModel = async (religionId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM pooja WHERE religion_id = ?",
    [religionId]
  );

  if (rows.length === 0) {
    return []; // No poojas found
  }

  return rows; // Return all poojas found
};

export const deletePoojaByIdModel = async (poojaId) => {
  const [result] = await pool.execute("DELETE FROM pooja WHERE id = ?", [
    poojaId,
  ]);

  if (result.affectedRows === 0) {
    return false; // No rows deleted, either pooja not found
  }

  return true; // Return true if deletion was successful
};

export const updatePoojaByIdModel = async (poojaId, poojaData) => {
  const {
    pooja_key,
    pooja_name,
    pooja_description,
    price,
    currency,
    duration_in_hours,
    image_url,
    s3_image_key,
    is_featured,
  } = poojaData;

  const [result] = await pool.execute(
    `UPDATE pooja 
     SET pooja_key = ?, pooja_name = ?, pooja_description = ?, price = ?, currency = ?, duration_in_hours = ?, image_url = ?, s3_image_key = ?, is_featured = ?
     WHERE id = ?`,
    [
      pooja_key,
      pooja_name,
      pooja_description,
      price,
      currency,
      duration_in_hours,
      image_url,
      s3_image_key,
      is_featured === "true" ? 1 : 0,
      poojaId,
    ]
  );

  if (result.affectedRows === 0) {
    return false; // No rows updated, either pooja not found
  }

  return {
    id: poojaId,
    pooja_key,
    pooja_name,
    pooja_description,
    price,
    currency,
    duration_in_hours,
    image_url,
    s3_image_key,
    is_featured,
  };
};

export const getPoojaDetailsByIdModel = async (poojaId) => {
  const [rows] = await pool.execute("SELECT * FROM pooja WHERE id = ?", [
    poojaId,
  ]);

  if (rows.length === 0) {
    return null; // No pooja found with the given ID
  }

  return rows[0]; // Return the first pooja found
};

export const getPoojaByKeyModel = async (poojaKey) => {
  const [rows] = await pool.execute("SELECT * FROM pooja WHERE pooja_key = ?", [
    poojaKey,
  ]);

  if (rows.length === 0) {
    return null; // No pooja found with the given key
  }

  return rows[0]; // Return the first pooja found
};
