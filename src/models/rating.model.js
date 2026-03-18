import pool from "../config/db.config.js";

export const createNewRatingsModel = async (ratingData) => {
  const { pooja_booking_id, review, comment, rate, user_id } = ratingData;

  //! Check if the user has completed a booking for the same pooja
  const existingPoojaBookingQuery = `
    SELECT * FROM pooja_bookings 
    WHERE id = ? AND user_id = ? AND (user_order_status = 'completed' OR user_order_status = 'auto-completed')
  `;

  const [existingBookings] = await pool.execute(existingPoojaBookingQuery, [
    pooja_booking_id,
    user_id,
  ]);

  if (existingBookings.length === 0) {
    throw new Error(
      "You can only review a pooja that you have completed booking for."
    );
  }

  const priest_id = existingBookings[0].priest_id;

  //! Check if the user has already submitted a review for the same pooja and priest
  const existingRatingQuery = `
    SELECT * FROM rating WHERE pooja_booking_id = ? AND user_id = ? AND priest_id = ?
  `;
  const [existingRatings] = await pool.execute(existingRatingQuery, [
    pooja_booking_id,
    user_id,
    priest_id,
  ]);

  if (existingRatings.length > 0) {
    throw new Error("You have already submitted a review for this pooja.");
  }

  //! Insert the new rating
  const insertQuery = `
  INSERT INTO rating (
      pooja_booking_id, 
      review, 
      comment, 
      rate, 
      user_id, 
      priest_id
      ) 
      VALUES (?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.execute(insertQuery, [
    pooja_booking_id,
    review,
    comment,
    rate,
    user_id,
    priest_id,
  ]);
  return {
    id: result.insertId,
    ...ratingData,
  };
};

export const getAllRatingModel = async (priestId) => {
  const query = `
      SELECT 
          r.id AS review_id, 
          pb.pooja_name, 
          r.review, 
          r.comment,
          r.rate,
          u.profile_image_url, 
          u.user_name,
          r.created_at,
          r.updated_at   
      FROM rating AS r 
      JOIN users AS u ON r.user_id = u.id 
      JOIN pooja_bookings AS pb ON r.pooja_booking_id = pb.id 
      WHERE r.priest_id = ?`;
  const [rows] = await pool.execute(query, [priestId]);

  if (rows.length === 0) {
    return [];
  }

  return rows;
};
