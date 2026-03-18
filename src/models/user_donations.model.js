import pool from "../config/db.config.js";
import { BadRequestError } from "../utils/errors.utils.js";

export const createUserDonationModel = async (userId, donationData) => {
  try {
    const { amount, currency, religion_id, order_id, payment_receipt_id } =
      donationData;

    const query = `
      INSERT INTO user_donations (user_id, order_id, payment_receipt_id, amount, currency, religion_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      order_id,
      payment_receipt_id,
      amount,
      currency,
      religion_id,
    ];

    const [result] = await pool.query(query, values);
    return {
      id: result.insertId,
      user_id: userId,
      order_id,
      payment_receipt_id,
      amount,
      currency,
      religion_id,
    };
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const updateUserDonationStatusModel = async (
  orderId,
  paymentDetails
) => {
  try {
    const { status, payment_id = null, signature = null } = paymentDetails;
    const query = `
      UPDATE user_donations
      SET payment_status = ?, payment_id = ?, signature = ?
      WHERE order_id = ?
    `;

    const values = [status, payment_id, signature, orderId];

    await pool.query(query, values);
  } catch (error) {
    throw new BadRequestError(error);
  }
};
