import pool from "../config/db.config.js";
import { BadRequestError } from "../utils/errors.utils.js";

export const createNewPoojaBookingModel = async (bookingData) => {
  const {
    user_id,
    pooja_id,
    temple_id,
    mode_of_pooja,
    pooja_name,
    pooja_location,
    pooja_date,
    pooja_time,
    duration_in_hours,
    gotra,
    additional_note,
    number_of_devotees,
    tax,
    total_price,
    service_charge,
    discount_amount,
    payment_id,
    order_id,
    payment_receipt_id,
    religion_id,
    priest_id,
  } = bookingData;

  const [result] = await pool.execute(
    `INSERT INTO pooja_bookings
         (user_id, pooja_id, temple_id, mode_of_pooja,
        pooja_name, pooja_location, pooja_date, pooja_time, duration_in_hours, 
        gotra, additional_note, number_of_devotees, tax, total_price, service_charge, discount_amount, payment_id, order_id,payment_receipt_id, religion_id, priest_id, payment_status) 
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      user_id,
      pooja_id,
      temple_id,
      mode_of_pooja,
      pooja_name,
      pooja_location || null,
      pooja_date || null,
      pooja_time || null,
      duration_in_hours,
      gotra || null,
      additional_note || null,
      number_of_devotees,
      tax ?? 0,
      total_price ?? 0,
      service_charge ?? 0,
      discount_amount ?? 0,
      payment_id || null,
      order_id || null,
      payment_receipt_id || null,
      religion_id,
      priest_id,
      "pending" 
    ]
  );
  return {
    id: result.insertId,
    user_id,
    pooja_id,
    temple_id,
    mode_of_pooja,
    pooja_name,
    pooja_location,
    pooja_date,
    pooja_time,
    duration_in_hours,
    gotra,
    additional_note,
    number_of_devotees,
    tax,
    total_price,
    service_charge,
    discount_amount,
    payment_id,
    order_id,
    payment_receipt_id,
    religion_id,
    priest_id,
  };
};

export const getCancelledPoojaBookingsModel = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        pb.id, 
        pb.user_id, 
        pb.pooja_id, 
        pb.temple_id, 
        pb.priest_id,
        pb.mode_of_pooja,
        pb.pooja_name, 
        pb.pooja_location, 
        pb.pooja_date, 
        pb.pooja_time,
        pb.duration_in_hours, 
        pb.gotra, 
        pb.additional_note, 
        pb.status,
        pb.priest_order_status,
        pb.number_of_devotees, 
        pb.tax, 
        pb.total_price, 
        pb.service_charge, 
        pb.discount_amount, 
        pb.order_id,
        pb.live_or_recorded_url,
        u2.user_name,

        -- Temple details as JSON object
        IF(pb.temple_id IS NOT NULL,
          JSON_OBJECT(
            'id', t.id,
            'temple_key', t.temple_key,
            'temple_name', t.temple_name,
            'temple_description', t.temple_description,
            'location', t.location,
            'image_url', t.image_url,
            'tagline', t.tagline
          ),
          NULL
        ) AS temple_details,
        
        -- Pooja details as JSON object
        IF(pb.pooja_id IS NOT NULL,
          JSON_OBJECT(
            'id', p.id,
            'pooja_key', p.pooja_key,
            'pooja_name', p.pooja_name,
            'pooja_description', p.pooja_description,
            'image_url', p.image_url
          ),
          NULL
        ) AS pooja_details,

        -- Priest details as JSON object
        IF(pb.priest_id IS NOT NULL,
          JSON_OBJECT(
            'id', u.id,
            'user_name', u.user_name,
            'profile_image_url', u.profile_image_url,
            'introduction', pr.introduction
          ),
          NULL
        ) AS priest_details,

        -- Souvernir details as JSON array
        IF(COUNT(pbs.id) > 0,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pbs.id,
              'souv_id', pbs.souv_id,
              'souv_name', s.souv_name,
              'souv_description', s.souv_description,
              'image_url', s.image_url,
              'quantity', pbs.quantity,
              'price_per_item', pbs.price
            )
          ),
          JSON_ARRAY()
        ) AS souvernir_details,
        pb.created_at, 
        pb.updated_at
    FROM pooja_bookings AS pb
    LEFT JOIN temples AS t ON pb.temple_id = t.id
    LEFT JOIN pooja AS p ON pb.pooja_id = p.id
    LEFT JOIN users AS u ON pb.priest_id = u.id
    LEFT JOIN users AS u2 ON pb.user_id = u2.id
    LEFT JOIN priests AS pr ON pb.priest_id = pr.user_id
    LEFT JOIN pooja_booking_souvernirs AS pbs ON pb.id = pbs.booking_id
    LEFT JOIN souvernirs AS s ON pbs.souv_id = s.id
    WHERE pb.user_id = ? AND pb.status = 'cancelled' AND pb.payment_status = 'completed'
    GROUP BY pb.id
    ORDER BY pb.pooja_date DESC
    `,
    [userId]
  );

  if (rows.length === 0) {
    return []; // No cancelled bookings found
  }

  if (rows.length > 0) {
    rows.forEach((row) => {
      if (row.souvernir_details && typeof row.souvernir_details === "string") {
        row.souvernir_details = JSON.parse(row.souvernir_details);
      }
      if (row.temple_details && typeof row.temple_details === "string") {
        row.temple_details = JSON.parse(row.temple_details);
      }
      if (row.pooja_details && typeof row.pooja_details === "string") {
        row.pooja_details = JSON.parse(row.pooja_details);
      }
      if (row.priest_details && typeof row.priest_details === "string") {
        row.priest_details = JSON.parse(row.priest_details);
      }
    });
  }

  return rows; // Return all cancelled bookings found
};

export const cancelPoojaBookingModel = async (bookingId, userId) => {
  const [existingRows] = await pool.execute(
    `SELECT * FROM pooja_bookings WHERE id = ? AND (user_id = ? OR priest_id = ?)`,
    [bookingId, userId, userId]
  );

  if (existingRows.length === 0) {
    throw new BadRequestError("Booking not found or already cancelled");
  }

  const booking = existingRows[0];
  const priestId = booking.priest_id;

  if (booking.status === "completed") {
    throw new BadRequestError(
      "Completed pooja bookings cannot be cancelled. Please contact support team."
    );
  }

  const [result] = await pool.execute(
    `UPDATE pooja_bookings 
     SET status = 'cancelled'
     WHERE id = ? AND (user_id = ? OR priest_id = ?)`,
    [bookingId, userId, userId]
  );

  if (result.affectedRows === 0) {
    throw new BadRequestError("Booking not found or already cancelled");
  }

  // If the cancel request comes from the PRIEST, automatically block them for 1 day
  if (priestId === userId) {
    await pool.execute(
      `INSERT INTO priest_unavailability (priest_id, start_date, end_date, reason)
       VALUES (?, CURDATE(), CURDATE(), 'System Auto-Block - Rejected Booking')`,
      [priestId]
    );
  }

  return true; // Return true if cancellation was successful
};

export const getUpcomingPoojaBookingsModel = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        pb.id, 
        pb.user_id, 
        pb.pooja_id, 
        pb.temple_id, 
        pb.priest_id,
        pb.mode_of_pooja,
        pb.pooja_name, 
        pb.pooja_location, 
        pb.pooja_date, 
        pb.pooja_time,
        pb.duration_in_hours, 
        pb.gotra, 
        pb.additional_note, 
        pb.status,
        pb.priest_order_status,
        pb.number_of_devotees, 
        pb.tax, 
        pb.total_price, 
        pb.service_charge, 
        pb.discount_amount,
        pb.order_id,
        pb.live_or_recorded_url,
        u2.user_name,


        -- Temple details as JSON object
        CASE
          WHEN pb.temple_id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', t.id,
              'temple_key', t.temple_key,
              'temple_name', t.temple_name,
              'temple_description', t.temple_description,
              'location', t.location,
              'image_url', t.image_url,
              'tagline', t.tagline
            )
            ELSE NULL END AS temple_details,
        
        -- Pooja details as JSON object
        CASE
          WHEN pb.pooja_id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', p.id,
              'pooja_key', p.pooja_key,
              'pooja_name', p.pooja_name,
              'pooja_description', p.pooja_description,
              'image_url', p.image_url
            )
        ELSE NULL END AS pooja_details,


        -- Priest details as JSON object
        CASE
          WHEN pb.priest_id IS NOT NULL THEN 
            JSON_OBJECT(
              'id', u.id,
              'user_name', u.user_name,
              'profile_image_url', u.profile_image_url,
              'introduction', pr.introduction
            )
        ELSE NULL END AS priest_details,

        -- Souvernir details as JSON array
        IF(COUNT(pbs.id) > 0,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pbs.id,
              'souv_id', pbs.souv_id,
              'souv_name', s.souv_name,
              'souv_description', s.souv_description,
              'image_url', s.image_url,
              'quantity', pbs.quantity,
              'price_per_item', pbs.price
            )
          ),
          JSON_ARRAY()
        ) AS souvernir_details,
        pb.created_at, 
        pb.updated_at
     FROM pooja_bookings AS pb
     LEFT JOIN temples AS t ON pb.temple_id = t.id
     LEFT JOIN pooja AS p ON pb.pooja_id = p.id
     LEFT JOIN users AS u ON pb.priest_id = u.id
     LEFT JOIN users AS u2 ON pb.user_id = u2.id
     LEFT JOIN priests AS pr ON pb.priest_id = pr.user_id
     LEFT JOIN pooja_booking_souvernirs AS pbs ON pb.id = pbs.booking_id
     LEFT JOIN souvernirs AS s ON pbs.souv_id = s.id
     WHERE pb.user_id = ? AND (pb.status = 'active' OR pb.status = 'pending') AND pb.pooja_date >= CURDATE() AND pb.payment_status = 'completed'
     GROUP BY pb.id
     ORDER BY pb.pooja_date ASC
     `,
    [userId]
  );

  if (rows.length === 0) {
    return []; // No upcoming bookings found
  }

  if (rows.length > 0) {
    rows.forEach((row) => {
      if (row.souvernir_details && typeof row.souvernir_details === "string") {
        row.souvernir_details = JSON.parse(row.souvernir_details);
      }
      if (row.temple_details && typeof row.temple_details === "string") {
        row.temple_details = JSON.parse(row.temple_details);
      }
      if (row.pooja_details && typeof row.pooja_details === "string") {
        row.pooja_details = JSON.parse(row.pooja_details);
      }
      if (row.priest_details && typeof row.priest_details === "string") {
        row.priest_details = JSON.parse(row.priest_details);
      }
    });
  }

  return rows; // Return all upcoming bookings found
};

export const getPreviousPoojaBookingsModel = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
        pb.id, 
        pb.user_id, 
        pb.pooja_id, 
        pb.temple_id, 
        pb.priest_id,
        pb.mode_of_pooja,
        pb.pooja_name, 
        pb.pooja_location, 
        pb.pooja_date, 
        pb.pooja_time,
        pb.duration_in_hours, 
        pb.gotra, 
        pb.additional_note, 
        pb.status,
        pb.priest_order_status,
        pb.number_of_devotees, 
        pb.tax, 
        pb.total_price, 
        pb.service_charge, 
        pb.discount_amount, 
        pb.order_id,
        pb.live_or_recorded_url,
        u2.user_name,

        -- Temple details as JSON object
        IF(pb.temple_id IS NOT NULL,
          JSON_OBJECT(
            'id', t.id,
            'temple_key', t.temple_key,
            'temple_name', t.temple_name,
            'temple_description', t.temple_description,
            'location', t.location,
            'image_url', t.image_url,
            'tagline', t.tagline
          ),
          NULL
        ) AS temple_details,
        
        -- Pooja details as JSON object
        IF(pb.pooja_id IS NOT NULL,
          JSON_OBJECT(
            'id', p.id,
            'pooja_key', p.pooja_key,
            'pooja_name', p.pooja_name,
            'pooja_description', p.pooja_description,
            'image_url', p.image_url
          ),
          NULL
        ) AS pooja_details,

        -- Priest details as JSON object
        IF(pb.priest_id IS NOT NULL,
          JSON_OBJECT(
            'id', u.id,
            'user_name', u.user_name,
            'profile_image_url', u.profile_image_url,
            'introduction', pr.introduction
          ),
          NULL
        ) AS priest_details,

        -- Souvernir details as JSON array
        IF(COUNT(pbs.id) > 0,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pbs.id,
              'souv_id', pbs.souv_id,
              'souv_name', s.souv_name,
              'souv_description', s.souv_description,
              'image_url', s.image_url,
              'quantity', pbs.quantity,
              'price_per_item', pbs.price
            )
          ),
          JSON_ARRAY()
        ) AS souvernir_details,
        IF(rating.id IS NOT NULL,
          JSON_OBJECT(
            'id', rating.id,
            'review', rating.review,
            'comment', rating.comment,
            'rate', rating.rate,
            'created_at', rating.created_at,
            'updated_at', rating.updated_at
          ),
          NULL
        ) AS rating_details,
        pb.created_at, 
        pb.updated_at
    FROM pooja_bookings AS pb
    LEFT JOIN temples AS t ON pb.temple_id = t.id
    LEFT JOIN pooja AS p ON pb.pooja_id = p.id
    LEFT JOIN users AS u ON pb.priest_id = u.id
    LEFT JOIN users AS u2 ON pb.user_id = u2.id
    LEFT JOIN priests AS pr ON pb.priest_id = pr.user_id
    LEFT JOIN pooja_booking_souvernirs AS pbs ON pb.id = pbs.booking_id
    LEFT JOIN souvernirs AS s ON pbs.souv_id = s.id
    LEFT JOIN rating as rating ON rating.pooja_booking_id = pb.id
    WHERE pb.user_id = ? AND (pb.status = 'completed' OR pb.status = 'cancelled' OR pb.status = 'pending' OR pb.status = 'active') AND pb.pooja_date < CURDATE() AND pb.payment_status = 'completed'
    GROUP BY pb.id
    ORDER BY pb.pooja_date DESC
    `,
    [userId]
  );

  if (rows.length === 0) {
    return []; // No previous bookings found
  }

  if (rows.length > 0) {
    rows.forEach((row) => {
      if (row.souvernir_details && typeof row.souvernir_details === "string") {
        row.souvernir_details = JSON.parse(row.souvernir_details);
      }
      if (row.temple_details && typeof row.temple_details === "string") {
        row.temple_details = JSON.parse(row.temple_details);
      }
      if (row.pooja_details && typeof row.pooja_details === "string") {
        row.pooja_details = JSON.parse(row.pooja_details);
      }
      if (row.priest_details && typeof row.priest_details === "string") {
        row.priest_details = JSON.parse(row.priest_details);
      }
      if (row.rating_details && typeof row.rating_details === "string") {
        row.rating_details = JSON.parse(row.rating_details);
      }
    });
  }

  return rows; // Return all previous bookings found
};

export const getAllBookingsModel = async (userId, pooja_date, pooja_id) => {
  let query = `
  SELECT 
      pb.id, 
      pb.user_id, 
      pb.pooja_id, 
      pb.temple_id, 
      pb.mode_of_pooja,
      pb.pooja_name, 
      pb.pooja_location, 
      pb.pooja_date, 
      pb.pooja_time,
      pb.duration_in_hours, 
      pb.gotra, 
      pb.additional_note, 
      pb.status,
      pb.number_of_devotees, 
      pb.tax, 
      pb.total_price, 
      pb.service_charge, 
      pb.discount_amount, 
      pb.live_or_recorded_url,
      pb.created_at, 
      pb.updated_at, 
      u.user_name
    FROM pooja_bookings AS pb
    JOIN users AS u ON pb.user_id = u.id 
    WHERE pb.priest_id = ?`;

  const parameters = [userId];

  if (pooja_date) {
    query += ` AND pb.pooja_date = ?`;
    parameters.push(pooja_date);
  }

  if (pooja_id) {
    query += ` AND pb.pooja_id = ?`;
    parameters.push(pooja_id);
  }

  const [rows] = await pool.execute(query, parameters);

  if (rows.length === 0) {
    return [];
  }

  return rows;
};

export const insertPoojaBookingSouvernirModel = async (souvData) => {
  const { booking_id, souv_id, quantity, price } = souvData;

  const [result] = await pool.execute(
    `INSERT INTO pooja_booking_souvernirs (booking_id, souv_id, quantity, price)
     VALUES (?, ?, ?, ?)`,
    [booking_id, souv_id, quantity, price]
  );

  return { id: result.insertId, ...souvData };
};

export const updatePoojaBookingPaymentDetailsByOrderIdModel = async (
  details
) => {
  const { orderId, status, paymentId, signature = null } = details;
  await pool.execute(
    `UPDATE pooja_bookings
     SET payment_status = ?, payment_id = ?, signature = ?
     WHERE order_id = ?`,
    [status, paymentId, signature, orderId]
  );
};

export const getPoojaBookingDetailsByOrderIdModel = async (orderId) => {
  const query = `
  SELECT 
        pb.id, 
        pb.user_id, 
        pb.pooja_id, 
        pb.temple_id, 
        pb.priest_id,
        pb.mode_of_pooja,
        pb.pooja_name, 
        pb.pooja_location, 
        pb.pooja_date, 
        pb.pooja_time,
        pb.duration_in_hours, 
        pb.gotra, 
        pb.additional_note, 
        pb.status,
        pb.priest_order_status,
        pb.number_of_devotees, 
        pb.tax, 
        pb.total_price, 
        pb.service_charge, 
        pb.discount_amount, 
        pb.order_id,
        pb.live_or_recorded_url,
        u2.user_name,

        -- Temple details as JSON object
        IF(pb.temple_id IS NOT NULL,
          JSON_OBJECT(
            'id', t.id,
            'temple_key', t.temple_key,
            'temple_name', t.temple_name,
            'temple_description', t.temple_description,
            'location', t.location,
            'image_url', t.image_url,
            'tagline', t.tagline
          ),
          NULL
        ) AS temple_details,
        
        -- Pooja details as JSON object
        IF(pb.pooja_id IS NOT NULL,
          JSON_OBJECT(
            'id', p.id,
            'pooja_key', p.pooja_key,
            'pooja_name', p.pooja_name,
            'pooja_description', p.pooja_description,
            'image_url', p.image_url
          ),
          NULL
        ) AS pooja_details,

        -- Priest details as JSON object
        IF(pb.priest_id IS NOT NULL,
          JSON_OBJECT(
            'id', u.id,
            'user_name', u.user_name,
            'profile_image_url', u.profile_image_url,
            'introduction', pr.introduction
          ),
          NULL
        ) AS priest_details,

        -- Souvernir details as JSON array
        IF(COUNT(pbs.id) > 0,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pbs.id,
              'souv_id', pbs.souv_id,
              'souv_name', s.souv_name,
              'souv_description', s.souv_description,
              'image_url', s.image_url,
              'quantity', pbs.quantity,
              'price_per_item', pbs.price
            )
          ),
          JSON_ARRAY()
        ) AS souvernir_details,
        pb.created_at, 
        pb.updated_at
    FROM pooja_bookings AS pb
    LEFT JOIN temples AS t ON pb.temple_id = t.id
    LEFT JOIN pooja AS p ON pb.pooja_id = p.id
    LEFT JOIN users AS u ON pb.priest_id = u.id
    LEFT JOIN users AS u2 ON pb.user_id = u2.id
    LEFT JOIN priests AS pr ON pb.priest_id = pr.user_id
    LEFT JOIN pooja_booking_souvernirs AS pbs ON pb.id = pbs.booking_id
    LEFT JOIN souvernirs AS s ON pbs.souv_id = s.id
    WHERE pb.order_id = ? AND pb.payment_status = 'completed'
    GROUP BY pb.id
    ORDER BY pb.pooja_date DESC
  `;

  const [rows] = await pool.execute(query, [orderId]);

  if (rows.length === 0) {
    return null; // No booking found
  }

  const booking = rows[0];

  if (
    booking.souvernir_details &&
    typeof booking.souvernir_details === "string"
  ) {
    booking.souvernir_details = JSON.parse(booking.souvernir_details);
  }
  if (booking.temple_details && typeof booking.temple_details === "string") {
    booking.temple_details = JSON.parse(booking.temple_details);
  }
  if (booking.pooja_details && typeof booking.pooja_details === "string") {
    booking.pooja_details = JSON.parse(booking.pooja_details);
  }
  if (booking.priest_details && typeof booking.priest_details === "string") {
    booking.priest_details = JSON.parse(booking.priest_details);
  }

  return booking; // Return the booking details
};
