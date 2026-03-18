import pool from "../config/db.config.js";
import envConfig from "../config/env.config.js";

export const getPriestEarningsModel = async (priestId, filter) => {
  let priest_id = "priest_id = ?";
  let values = [priestId];

  if (filter === "today") {
    priest_id += " AND DATE(updated_at) = CURDATE()";
  } else if (filter === "month") {
    priest_id +=
      " AND MONTH(updated_at) = MONTH(CURDATE()) AND YEAR(updated_at) = YEAR(CURDATE())";
  } else if (filter === "year") {
    priest_id += " AND YEAR(updated_at) = YEAR(CURDATE())";
  }

  const [rows] = await pool.execute(
    `SELECT 
            COALESCE(SUM(earning_amount), 0) AS earning_amount,
            COALESCE(SUM(bonus_coin), 0) AS bonus_coins,
            COUNT(*) AS total_requests
      FROM priests_earnings
      WHERE ${priest_id}`,
    values
  );

  return rows[0];
};

export const autoInsertPriestEarningsJobModel = async () => {
  const [completedBookings] = await pool.execute(`
        SELECT * FROM pooja_bookings 
        WHERE priest_order_status = 'completed'
        AND completed_at <= DATE_SUB(NOW(), INTERVAL 3 DAY)
        AND order_id NOT IN (
            SELECT order_id FROM priests_earnings
        )
    `);

  for (const booking of completedBookings) {
    const totalPrice = booking.total_price;

    if (!totalPrice) {
      throw new Error("Invalid total_price value in booking.");
    }

    const { PRIEST_COMMISSION_PERCENTAGE, PRIEST_BONUS_COIN_PERCENTAGE } =
      envConfig;

    const earningAmount = (totalPrice * PRIEST_COMMISSION_PERCENTAGE).toFixed(
      2
    );
    const bonusCoin = (totalPrice * PRIEST_BONUS_COIN_PERCENTAGE).toFixed(2);

    await pool.execute(
      `
            INSERT INTO priests_earnings 
            (user_id, payment_id, order_id, pooja_id, priest_id, earning_amount, bonus_coin)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      [
        booking.user_id,
        booking.payment_id,
        booking.order_id,
        booking.pooja_id,
        booking.priest_id,
        earningAmount,
        bonusCoin,
      ]
    );

    await pool.execute(
      `
            UPDATE pooja_bookings
            SET user_order_status = 'auto-completed'
            WHERE order_id = ?`,
      [booking.order_id]
    );
  }

  console.log(
    `Auto earnings insert completed. Total processed: ${completedBookings.length}`
  );
};

export const insertPriestEarningModel = async (bookingData) => {
  const { orderId, bookingId, priestId } = bookingData;

  //! Check if an earning record for the given orderId already exists
  const existingEarningsQuery = `
  SELECT * FROM priests_earnings 
  WHERE order_id = ? AND booking_id = ? AND priest_id = ?`;
  const [existingEarnings] = await pool.execute(existingEarningsQuery, [
    orderId,
    bookingId,
    priestId,
  ]);

  if (existingEarnings.length > 0) {
    throw new BadRequestError(
      `Earning record for order ${orderId} already exists.`
    );
  }

  //! Get existing booking details
  const existingBookingQuery = `
    SELECT * FROM pooja_bookings 
    WHERE id = ? AND order_id = ? AND priest_id = ?
  `;
  const [existingBookings] = await pool.execute(existingBookingQuery, [
    bookingId,
    orderId,
    priestId,
  ]);

  if (existingBookings.length === 0) {
    throw new BadRequestError("No booking found for the provided details.");
  }

  const bookingDetails = existingBookings[0];
  const totalPrice = bookingDetails.total_price;

  const { PRIEST_COMMISSION_PERCENTAGE, PRIEST_BONUS_COIN_PERCENTAGE } =
    envConfig;

  const earningAmount = (totalPrice * PRIEST_COMMISSION_PERCENTAGE).toFixed(2);
  const bonusCoin = (totalPrice * PRIEST_BONUS_COIN_PERCENTAGE).toFixed(2);

  const insertEarningQuery = `
    INSERT INTO priests_earnings (order_id, booking_id, priest_id, earning_amount, bonus_coin)
    VALUES (?, ?, ?, ?, ?)
  `;

  await pool.execute(insertEarningQuery, [
    orderId,
    bookingId,
    priestId,
    earningAmount,
    bonusCoin,
  ]);
};
