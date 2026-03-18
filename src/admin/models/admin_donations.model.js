import pool from "../../config/db.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";

export const getAllUsersDonationsModel = async (period, religionId) => {
  let whereClause = `ud.payment_status = "completed"`;
  if (religionId) {
    whereClause += ` AND ud.religion_id = ?`;
  }

  switch (period) {
    case "today":
      whereClause += ` AND DATE(ud.donation_date) = CURDATE()`;
      break;
    case "month":
      whereClause += ` AND YEAR(ud.donation_date) = YEAR(CURDATE()) AND MONTH(ud.donation_date) = MONTH(CURDATE())`;
      break;
    case "year":
      whereClause += ` AND YEAR(ud.donation_date) = YEAR(CURDATE())`;
      break;
    default:
      break;
  }

  const donationsQuery = `
  SELECT 
    ud.*,
    u.user_name,
    u.email,
    r.religion_name
  FROM user_donations ud
  LEFT JOIN users u ON ud.user_id = u.id
  LEFT JOIN religions r ON ud.religion_id = r.id
  WHERE ${whereClause}
  GROUP BY ud.id
  ORDER BY ud.donation_date DESC
  `;

  const totalQuery = `
        SELECT
            SUM(ud.amount) AS total_amount
        FROM user_donations ud
        WHERE ${whereClause}
    `;

  try {
    const [rows] = await pool.query(
      donationsQuery,
      religionId ? [religionId] : []
    );
    const [total] = await pool.query(
      totalQuery,
      religionId ? [religionId] : []
    );

    return { total_amount: total[0].total_amount || 0, donations: rows };
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw new BadRequestError("Failed to fetch donations");
  }
};

export const createAdminDonationContentModel = async (donationData) => {
  const {
    donation_key,
    donation_name,
    donation_description,
    religion_id,
    image_url,
    s3_image_key,
  } = donationData;

  const insertQuery = `
    INSERT INTO donations (donation_key, donation_name, donation_description, religion_id, image_url, s3_image_key)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(insertQuery, [
      donation_key,
      donation_name,
      donation_description,
      religion_id,
      image_url,
      s3_image_key,
    ]);
    return { id: result.insertId, ...donationData };
  } catch (error) {
    console.error("Error creating donation content:", error);
    throw new BadRequestError("Failed to create donation content");
  }
};

export const getAllAdminDonationContentsModel = async (religionId) => {
  const query = `
    SELECT * FROM donations WHERE religion_id = ?
  `;

  try {
    const [rows] = await pool.query(query, [religionId]);
    return rows;
  } catch (error) {
    console.error("Error fetching all donation contents:", error);
    throw new BadRequestError("Failed to fetch all donation contents");
  }
};

export const deleteAdminDonationContentByIdModel = async (id) => {
  try {
    const deleteQuery = `DELETE FROM donations WHERE id = ?`;
    const [result] = await pool.query(deleteQuery, [id]);
    if (result.affectedRows === 0) {
      throw new BadRequestError("Donation content not found");
    }
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error deleting donation content:", error);
    throw new BadRequestError("Failed to delete donation content");
  }
};

export const getExistingDonationContentByDonationIdModel = async (id) => {
  const query = `
    SELECT * FROM donations WHERE id = ?
  `;

  try {
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching existing donation content:", error);
    throw new BadRequestError("Failed to fetch existing donation content");
  }
};

export const updateAdminDonationContentByIdModel = async (id, donationData) => {
  const { donation_name, donation_description, image_url, s3_image_key } =
    donationData;

  const updateQuery = `
    UPDATE donations SET
      donation_name = ?,
      donation_description = ?,
      image_url = ?,
      s3_image_key = ?
    WHERE id = ?
  `;

  try {
    const [result] = await pool.query(updateQuery, [
      donation_name,
      donation_description,
      image_url,
      s3_image_key,
      id,
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error updating donation content:", error);
    throw new BadRequestError("Failed to update donation content");
  }
};
