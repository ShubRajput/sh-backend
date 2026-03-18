import pool from "../config/db.config.js";
import { BadRequestError } from "../utils/errors.utils.js";

export const getAllOfferingsModel = async (religionId) => {
  const query = `
    SELECT
        o.*,
        CASE WHEN COUNT(oi.id) > 0 THEN JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', oi.id,
                'image_url', oi.image_url,
                'image_type', oi.image_type,
                's3_image_key', oi.s3_image_key
            )
        ) ELSE JSON_ARRAY()
        END AS images
    FROM offerings o
    LEFT JOIN offerings_images oi ON o.id = oi.offering_id
    WHERE o.religion_id = ?
    GROUP BY o.id
    `;

  const [rows] = await pool.execute(query, [religionId]);
  if (rows.length === 0) {
    return [];
  }
  return rows;
};

export const getOfferingsByIdModel = async (offeringId) => {
  const query = `
    SELECT
        o.*,
        CASE WHEN oi.id IS NOT NULL THEN JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', oi.id,
                'image_url', oi.image_url,
                'image_type', oi.image_type,
                's3_image_key', oi.s3_image_key
            )
        ) ELSE JSON_ARRAY()
        END AS images
    FROM offerings o
    LEFT JOIN offerings_images oi ON o.id = oi.offering_id
    WHERE o.id = ?
    GROUP BY o.id
    `;
  const [rows] = await pool.execute(query, [offeringId]);
  if (rows.length === 0) {
    throw new BadRequestError("Offerings not found");
  }
  if (rows.length > 0 && rows[0].images && typeof rows[0].images === "string") {
    rows[0].images = JSON.parse(rows[0].images);
  }
  return rows[0];
};

export const submitUserOfferingModel = async (userId, offeringData) => {
  const {
    temple_id,
    order_id,
    payment_receipt_id,
    amount,
    currency,
    religion_id,
    offering_items = [],
  } = offeringData;
  const query = `
    INSERT INTO user_offerings (
    user_id, 
    temple_id, 
    order_id, 
    payment_receipt_id, 
    amount, 
    currency, 
    religion_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    userId,
    temple_id,
    order_id,
    payment_receipt_id,
    amount,
    currency,
    religion_id,
  ]);

  const insertOfferingItemsQuery = `
    INSERT INTO user_offerings_items 
    (user_offering_id, offering_id, item_name, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `;

  const itemNameQuery = `SELECT * FROM offerings WHERE id = ?`;

  for (const item of offering_items) {
    const { offering_id, quantity } = item;

    const [itemNameRow] = await pool.execute(itemNameQuery, [offering_id]);
    const itemName = itemNameRow[0]?.offering_name || "Unknown Item";
    const price = itemNameRow[0]?.price * quantity || 0;
    await pool.execute(insertOfferingItemsQuery, [
      result.insertId,
      offering_id,
      itemName,
      quantity,
      price,
    ]);
  }
  return { id: result.insertId, ...offeringData };
};

export const updateUserOfferingModel = async (orderId, paymentDetails) => {
  const { status, payment_id = null, signature = null } = paymentDetails;
  const query = `
    UPDATE user_offerings
    SET payment_status = ?, payment_id = ?, signature = ?
    WHERE order_id = ?
  `;
  const [result] = await pool.execute(query, [
    status,
    payment_id,
    signature,
    orderId,
  ]);
  return result.affectedRows > 0;
};

export const getOfferingBasicDetailsModel = async (offeringId) => {
  const query = `
    SELECT 
        id, 
        offering_name, 
        price
    FROM offerings
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [offeringId]);
  if (rows.length === 0) {
    throw new BadRequestError("Offering item not found");
  }
  return rows[0];
};
