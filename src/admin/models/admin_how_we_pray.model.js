import pool from "../../config/db.config.js";

export const createHowWePrayModel = async (data) => {
  const { header_text, description, image_url, s3_image_key, religion_id } =
    data;
  const query = `
    INSERT INTO how_we_pray (header_text, description, image_url, s3_image_key, religion_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    header_text,
    description,
    image_url,
    s3_image_key,
    religion_id,
  ];
  try {
    const [result] = await pool.query(query, values);
    return {
      id: result.insertId,
      header_text,
      description,
      image_url,
      s3_image_key,
      religion_id,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllHowWePrayModel = async (religionId) => {
  const query = `
        SELECT * FROM how_we_pray WHERE religion_id = ?
    `;
  try {
    const [rows] = await pool.query(query, [religionId]);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const deleteHowWePrayByIdModel = async (id) => {
  const query = `
        DELETE FROM how_we_pray WHERE id = ?
    `;
  try {
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const getHowWePrayByIdModel = async (id) => {
  const query = `
        SELECT * FROM how_we_pray WHERE id = ?
    `;
  try {
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateHowWePrayByIdModel = async (id, data) => {
  const { header_text, description, image_url, s3_image_key } = data;
  const query = `
        UPDATE how_we_pray SET header_text = ?, description = ?, image_url = ?, s3_image_key = ?
        WHERE id = ?
    `;
  const values = [header_text, description, image_url, s3_image_key, id];
  try {
    const [result] = await pool.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
