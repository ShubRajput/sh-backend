import pool from "../config/db.config.js";
import { BadRequestError } from "../utils/errors.utils.js";

export const getReligionListModel = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM religions");
    return rows;
  } catch (error) {
    throw new BadRequestError("Error fetching religion list");
  }
};

export const getTempleListModel = async (religionId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM temples WHERE religion_id = ?",
      [religionId]
    );
    return rows;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const getHowWePrayListModel = async (religionId) => {
  try {
    const query = `
        SELECT * FROM how_we_pray WHERE religion_id = ?
    `;
    const [rows] = await pool.query(query, [religionId]);
    return rows;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const getSouvernirsListModel = async (religionId) => {
  try {
    const query = `
                SELECT * FROM souvernirs WHERE religion_id = ?
            `;
    const [rows] = await pool.query(query, [religionId]);
    return rows;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const getPoojaListModel = async (religionId, isFeatured) => {
  try {
    let query = `
        SELECT * FROM pooja WHERE religion_id = ? 
    `;
    const values = [religionId];
    if (
      isFeatured != null &&
      (isFeatured === "true" || isFeatured === "false")
    ) {
      query += " AND is_featured = ?";
      values.push(isFeatured === "true");
    }

    const [rows] = await pool.query(query, values);
    return rows;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const getOfferingsListModel = async (religionId) => {
  try {
    const query = `
        SELECT 
          off.*,
          CASE WHEN COUNT(off_img.id) > 0 THEN
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', off_img.id,
                'image_url', off_img.image_url,
                'image_type', off_img.image_type,
                's3_image_key', off_img.s3_image_key
              )
            )
          ELSE JSON_ARRAY()
          END AS images
      FROM offerings off 
      LEFT JOIN offerings_images off_img ON off.id = off_img.offering_id
      WHERE religion_id = ?
      GROUP BY off.id
    `;
    const [rows] = await pool.query(query, [religionId]);

    if (rows.length > 0) {
      rows.forEach((row) => {
        if (row.images && typeof row.images === "string") {
          row.images = JSON.parse(row.images);
        }
      });
    }
    return rows;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const getDonationDetailsListModel = async (religionId) => {
  try {
    const query = `
      SELECT * FROM donations WHERE religion_id = ?
    `;
    const [rows] = await pool.query(query, [religionId]);
    return rows;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const getReligionDetailsByIdModel = async (id) => {
  try {
    const query = `
      SELECT r.*,
        CASE WHEN COUNT(ri.id) > 0 THEN JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ri.id,
              'image_url', ri.image_url,
              'image_type', ri.image_type,
              's3_image_key', ri.s3_image_key
            )
          ) ELSE JSON_ARRAY()
          END AS images
        FROM religions r
        LEFT JOIN religions_images ri ON r.id = ri.religion_id
        WHERE r.id = ?
        GROUP BY r.id
    `;
    const [rows] = await pool.query(query, [id]);
    if (
      rows.length > 0 &&
      rows[0].images &&
      typeof rows[0].images === "string"
    ) {
      rows[0].images = JSON.parse(rows[0].images);
    }
    return rows[0];
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const getAllBanksModel = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM banks");
    return rows;
  } catch (error) {
    throw new BadRequestError("Error fetching bank list");
  }
};
