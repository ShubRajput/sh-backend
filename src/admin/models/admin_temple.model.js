import pool from "../../config/db.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";

export const createNewTempleModel = async (templeData) => {
  const {
    temple_key,
    temple_name,
    temple_description,
    location,
    image_url,
    s3_image_key,
    tagline,
    religion_id,
    temple_type_id,
  } = templeData;

  const parsedTempleTypeId = temple_type_id === "" || temple_type_id === "null" || temple_type_id === undefined ? null : temple_type_id;

  const [existingTemple] = await pool.execute(
    "SELECT * FROM temples WHERE temple_key = ?",
    [temple_key]
  );
  if (existingTemple.length > 0) {
    throw new BadRequestError("Temple with this key already exists");
  }
  const [result] = await pool.execute(
    "INSERT INTO temples (temple_key, temple_name, temple_description, location, image_url, s3_image_key, tagline, religion_id, temple_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      temple_key,
      temple_name,
      temple_description || null,
      location || null,
      image_url || null,
      s3_image_key || null,
      tagline || null,
      religion_id,
      parsedTempleTypeId,
    ]
  );
  return {
    id: result.insertId,
    temple_key,
    temple_name,
    temple_description,
    location,
    image_url,
    s3_image_key,
    tagline,
    religion_id,
    temple_type_id: temple_type_id || null,
  };
};

export const getTemplesDetailsModel = async (religionId) => {
  const [rows] = await pool.execute(
    `SELECT t.*, tt.name AS temple_type_name, tt.multiplier AS temple_type_multiplier
     FROM temples t
     LEFT JOIN temple_types tt ON t.temple_type_id = tt.id
     WHERE t.religion_id = ?`,
    [religionId]
  );
  if (rows.length === 0) {
    return [];
  }
  return rows;
};

export const deleteTempleByIdModel = async (templeId) => {
  const [result] = await pool.execute("DELETE FROM temples WHERE id = ?", [
    templeId,
  ]);

  if (result.affectedRows === 0) {
    throw new BadRequestError("Temple not found or already deleted");
  }

  return true;
};

export const getTempleByIdModel = async (templeId) => {
  const [rows] = await pool.execute("SELECT * FROM temples WHERE id = ?", [
    templeId,
  ]);

  if (rows.length === 0) {
    throw new BadRequestError("Temple not found");
  }

  return rows[0]; // Return the temple found
};

export const getTempleDetailsByKeyModel = async (templeKey) => {
  const [rows] = await pool.execute(
    "SELECT * FROM temples WHERE temple_key = ?",
    [templeKey]
  );

  if (rows.length === 0) {
    return null; // No temple found with the given key
  }

  return rows[0]; // Return the temple found
};

export const updateTempleByIdModel = async (templeId, templeData) => {
  const {
    temple_key,
    temple_name,
    temple_description,
    location,
    image_url,
    s3_image_key,
    tagline,
    temple_type_id,
  } = templeData;

  const [existingTemple] = await pool.execute(
    "SELECT * FROM temples WHERE id = ?",
    [templeId]
  );

  if (existingTemple.length === 0) {
    throw new BadRequestError("Temple not found");
  }

  let updatedTempleTypeId = existingTemple[0].temple_type_id;
  if (temple_type_id !== undefined) {
    updatedTempleTypeId = temple_type_id === "" || temple_type_id === "null" ? null : temple_type_id;
  }

  await pool.execute(
    "UPDATE temples SET temple_key = ?, temple_name = ?, temple_description = ?, location = ?, image_url = ?, s3_image_key = ?, tagline = ?, temple_type_id = ? WHERE id = ?",
    [
      temple_key || existingTemple[0].temple_key,
      temple_name || existingTemple[0].temple_name,
      temple_description || existingTemple[0].temple_description,
      location || existingTemple[0].location,
      image_url || existingTemple[0].image_url,
      s3_image_key || existingTemple[0].s3_image_key,
      tagline || existingTemple[0].tagline,
      updatedTempleTypeId,
      templeId,
    ]
  );

  return {
    id: templeId,
    temple_key: temple_key || existingTemple[0].temple_key,
    temple_name: temple_name || existingTemple[0].temple_name,
    temple_description: temple_description || existingTemple[0].temple_description,
    location: location || existingTemple[0].location,
    image_url: image_url || existingTemple[0].image_url,
    s3_image_key: s3_image_key || existingTemple[0].s3_image_key,
    tagline: tagline || existingTemple[0].tagline,
    temple_type_id: updatedTempleTypeId,
  };
};
