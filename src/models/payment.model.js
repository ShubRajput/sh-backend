import pool from "../config/db.config.js";
import { BadRequestError } from "../utils/errors.utils.js";

export const addPaymentDetailsModel = async (priestId, paymentDetails) => {
  const { account_holder_name, bank_name, branch_name, account_number } =
    paymentDetails;
  const [result] = await pool.execute(
    `INSERT INTO payment_details (priest_id,account_holder_name,bank_name,branch_name,account_number)
        VALUES (?,?,?,?,?)`,
    [priestId, account_holder_name, bank_name, branch_name, account_number]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to add payment details");
  }

  return {
    id: result.insertId,
    priestId,
    account_holder_name,
    bank_name,
    branch_name,
    account_number,
  };
};

export const updatePaymentDetailsModel = async (
  paymentDetailsId,
  paymentDetailsData
) => {
  const { account_holder_name, bank_name, branch_name, account_number } =
    paymentDetailsData;

  const [result] = await pool.execute(
    `UPDATE payment_details 
    SET account_holder_name = ?, bank_name= ?, branch_name= ?, account_number= ?
    WHERE id = ?`,
    [
      account_holder_name,
      bank_name,
      branch_name,
      account_number,
      paymentDetailsId,
    ]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to update payment details");
  }

  return {
    id: paymentDetailsId,
    account_holder_name,
    bank_name,
    branch_name,
    account_number,
  };
};

export const getAllPriestAccountsModel = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM payment_details WHERE priest_id = ?`,
    [userId]
  );

  return rows;
};
