import pool from "../../config/db.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";

export const createSouvernirModel = async (souvernirData) => {
  const {
    souv_key,
    souv_name,
    souv_description,
    price,
    currency,
    image_url,
    s3_image_key,
    religion_id,
  } = souvernirData;
  const [result] = await pool.execute(
    `INSERT INTO souvernirs (souv_key, souv_name, souv_description, price, currency,image_url, s3_image_key, religion_id) 
         VALUES (?, ?, ?, ?, ?,?,?, ?)`,
    [
      souv_key,
      souv_name,
      souv_description || null,
      price,
      currency,
      image_url,
      s3_image_key,
      religion_id,
    ]
  );
  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to create souvernir");
  }
  return { id: result.insertId, ...souvernirData };
};

export const getAllSouvernirsModel = async (religionId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM souvernirs WHERE religion_id = ?`,
    [religionId]
  );
  if (rows.length === 0) {
    return []; // No souvernirs found
  }
  return rows; // Return all souvernirs found
};

export const deleteSouvernirByIdModel = async (souvernirId) => {
  const [result] = await pool.execute(`DELETE FROM souvernirs WHERE id = ?`, [
    souvernirId,
  ]);
  if (result.affectedRows === 0) {
    return false;
  }
  return true;
};

export const updateSouvernirByIdModel = async (souvernirId, souvData) => {
  const {
    souv_key,
    souv_name,
    souv_description,
    price,
    currency,
    image_url,
    s3_image_key,
  } = souvData;
  const [result] = await pool.execute(
    `UPDATE souvernirs 
     SET souv_key = ?, souv_name = ?, souv_description = ?, price = ?, currency = ?, image_url = ?, s3_image_key = ? 
     WHERE id = ?`,
    [
      souv_key,
      souv_name,
      souv_description || null,
      price,
      currency,
      image_url,
      s3_image_key,
      souvernirId,
    ]
  );
  if (result.affectedRows === 0) {
    throw new BadRequestError(
      "Failed to update souvernir or souvernir not found"
    );
  }
  return { id: souvernirId, ...souvData };
};

export const getSouvernirByIdModel = async (souvernirId) => {
  const [rows] = await pool.execute(`SELECT * FROM souvernirs WHERE id = ?`, [
    souvernirId,
  ]);
  if (rows.length === 0) {
    throw new BadRequestError("Souvernir not found");
  }
  return rows[0]; // Return the souvernir found
};

export const getSouvernirDetailsByKeyModel = async (souvKey) => {
  const [rows] = await pool.execute(
    `SELECT * FROM souvernirs WHERE souv_key = ?`,
    [souvKey]
  );
  if (rows.length === 0) {
    return null; // No souvernir found with the given key
  }
  return rows[0]; // Return the souvernir found
};
