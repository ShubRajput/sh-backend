import pool from "../config/db.config.js";
import envConfig from "../config/env.config.js";
import { BadRequestError } from "../utils/errors.utils.js";

// Update pooja status to accepted and upload url
export const handlePriestPoojaRequestModel = async ({
  order_id,
  status,
  live_or_recorded_url,
  priest_id,
}) => {
  const [existingRows] = await pool.execute(
    `SELECT * FROM pooja_bookings WHERE order_id = ?`,
    [order_id]
  );
  if (existingRows.length === 0) {
    throw new BadRequestError("No existing request found to update.");
  }

  if (live_or_recorded_url && existingRows[0].mode_of_pooja === "on_site") {
    throw new BadRequestError(
      "Live or recorded URL can only be provided for online pooja."
    );
  }

  const updates = [];
  const params = [];

  if (status !== undefined) {
    updates.push("status = ?");
    params.push(status);
    updates.push("priest_order_status = ?");
    params.push(status);
  }
  if (live_or_recorded_url !== undefined) {
    updates.push("live_or_recorded_url = ?");
    params.push(live_or_recorded_url);
  }
  if (priest_id !== undefined) {
    updates.push("priest_id = ?");
    params.push(priest_id);
  }

  if (updates.length === 0) {
    throw new BadRequestError("Nothing to update.");
  }

  const query = `
        UPDATE pooja_bookings
        SET ${updates.join(", ")}
        WHERE order_id = ?
    `;

  params.push(order_id);
  await pool.execute(query, params);

  return {
    ...existingRows[0],
    ...(status !== undefined && { status }),
    ...(live_or_recorded_url !== undefined && { live_or_recorded_url }),
  };
};

export const getPoojaRequestByStatusModel = async (priestId, status) => {
  let whereQuery;
  let joinPriestQuery;
  const values = [];

  const [priestDetails] = await pool.execute(
    "SELECT * FROM priests WHERE user_id = ?",
    [priestId]
  );
  if (priestDetails.length === 0) {
    throw new BadRequestError("Priest details not found.");
  }

  const priestReligionId = priestDetails[0].religion_id;
  const priestLocation = priestDetails[0].priest_location;

  if (status === "active" || status === "completed" || status === "cancelled") {
    joinPriestQuery = "JOIN priests AS pr ON pb.priest_id = pr.user_id ";
    whereQuery =
      " pb.priest_id = ? AND ";
    values.push(priestId);
    values.push(status);
  } else if (status === "pending") {
    //! In there checking ignored poojas
    whereQuery =
      "pipb.pooja_booking_id IS NULL AND pb.priest_id = ? AND pb.user_id != ? AND ";
    joinPriestQuery =
      "LEFT JOIN priest_ignored_pooja_bookings AS pipb ON pb.id = pipb.pooja_booking_id AND pipb.priest_id = ? ";
    values.push(priestId);
    values.push(priestId);
    values.push(priestId); // pipb join param
    values.push(status);
  } else {
    throw new BadRequestError("Invalid status value.");
  }

  const { PRIEST_COMMISSION_PERCENTAGE } = envConfig;

  const [poojaRows] = await pool.execute(
    `SELECT 
        pb.id,
        pb.pooja_name, 
        pb.pooja_location,
        pb.pooja_date,
        pb.pooja_time,
        pb.total_price * ${PRIEST_COMMISSION_PERCENTAGE} AS total_price,
        pb.mode_of_pooja,
        pb.number_of_devotees,
        pb.status,
        pb.order_id,
        p.image_url,
        u.user_name,
        p.pooja_key
        FROM pooja_bookings AS pb
        LEFT JOIN users AS u ON pb.user_id = u.id
        LEFT JOIN pooja AS p ON pb.pooja_id = p.id
        ${joinPriestQuery}
        WHERE ${whereQuery} pb.status = ? AND pb.payment_status = "completed" AND pb.religion_id = ?
        ORDER BY pb.created_at DESC
    `,
    [...values, priestReligionId] // Spread the values
  );

  if (poojaRows.length === 0) {
    return [];
  }
  return poojaRows;
};

// change accepted pooja to cancel or completed.
export const updateAcceptedPoojaRequestModel = async (requestedData) => {
  const { action, orderId, priestId } = requestedData;

  const [existingRows] = await pool.execute(
    `SELECT * FROM pooja_bookings WHERE priest_id = ? AND order_id = ?`,
    [priestId, orderId]
  );

  if (existingRows.length === 0) {
    throw new BadRequestError("No record found to update.");
  }

  const booking = existingRows[0];
  const poojaDateTime = new Date(`${booking.pooja_date}T${booking.pooja_time}`);
  const currentDate = new Date();

  let status,
    urlValue,
    completedAt = booking.completed_at;

  if (action === "cancelled") {
    status = "cancelled";
    urlValue = null;
    completedAt = null;
  } else if (action === "completed") {
    if (currentDate < poojaDateTime) {
      throw new BadRequestError(
        "Pooja cannot be marked completed before its scheduled time."
      );
    }

    status = "completed";
    urlValue = existingRows[0].live_or_recorded_url;
    completedAt = currentDate; // update completed time when priest mark it as completed.
  } else {
    throw new BadRequestError("Invalid action.");
  }

  const updatePoojaBookingQuery = `
  UPDATE pooja_bookings 
         SET status = ?, 
         live_or_recorded_url = ?, 
         priest_order_status = ?, 
         user_order_status = ?,
         completed_at = ?
         WHERE priest_id = ? AND order_id = ?
  `;

  await pool.execute(updatePoojaBookingQuery, [
    status,
    urlValue,
    status,
    status,
    completedAt,
    priestId,
    orderId,
  ]);

  return existingRows[0];
};

export const getPendingNewPoojaRequestsModel = async (priestId) => {
  const query = `
    SELECT 
      pb.id,
      pb.mode_of_pooja,
      pb.pooja_name,
      pb.pooja_location,
      pb.pooja_date,
      pb.pooja_time,
      pb.duration_in_hours,
      pb.gotra,
      pb.additional_note,
      pb.number_of_devotees,
      pb.total_price,
      pb.order_id,
      CASE WHEN p.id IS NOT NULL THEN
          JSON_OBJECT(
            'id', p.id,
            'pooja_key', p.pooja_key,
            'pooja_name', p.pooja_name,
            'image_url', p.image_url
          ) ELSE NULL
      END AS pooja_details,
      CASE WHEN  t.id IS NOT NULL THEN
          JSON_OBJECT(
            'id', t.id,
            'temple_key', t.temple_key,
            'temple_name', t.temple_name,
            'location', t.location,
            'image_url', t.image_url
          ) ELSE NULL
      END AS temple_details
    FROM pooja_bookings AS pb
    LEFT JOIN pooja AS p ON pb.pooja_id = p.id
    LEFT JOIN temples AS t ON pb.temple_id = t.id
    WHERE pb.status = 'pending' AND pb.payment_status = 'completed' AND pb.priest_id = ?
  `;

  const [rows] = await pool.execute(query, [priestId]);
  return rows;
};

export const ignorePoojaBookingRequestModel = async (priestId, orderId, cancelReason) => {
  //! Check if the pooja booking exists and is eligible for ignoring
  const existingBookingQuery = `
    SELECT * FROM pooja_bookings 
    WHERE order_id = ? AND status = 'pending' AND payment_status = 'completed'
  `;

  const [existingBookings] = await pool.execute(existingBookingQuery, [
    orderId,
  ]);

  if (existingBookings.length === 0) {
    throw new BadRequestError("Item not found or not eligible for ignoring.");
  }

  //! Update the main booking to cancelled since the initial priest rejected it.
  const updatePoojaBookingQuery = `
  UPDATE pooja_bookings 
         SET status = 'cancelled', 
         priest_order_status = 'cancelled', 
         user_order_status = 'cancelled',
         cancel_reason = ?
         WHERE order_id = ?
  `;

  const [result] = await pool.execute(updatePoojaBookingQuery, [
    cancelReason,
    orderId,
  ]);

  if (result.affectedRows === 0) {
    throw new BadRequestError("Failed to ignore the pooja booking request.");
  }

  return result.affectedRows > 0;
};

export const cancelPriestPoojaRequestModel = async (priestId, orderId, cancelReason) => {
  const [existingRows] = await pool.execute(
    `SELECT * FROM pooja_bookings WHERE priest_id = ? AND order_id = ?`,
    [priestId, orderId]
  );

  if (existingRows.length === 0) {
    throw new BadRequestError("No record found to update.");
  }

  if (existingRows[0].status !== 'pending') {
    throw new BadRequestError("Only pending bookings can be cancelled.");
  }

  const updatePoojaBookingQuery = `
  UPDATE pooja_bookings 
         SET status = 'cancelled', 
         priest_order_status = 'cancelled', 
         user_order_status = 'cancelled',
         cancel_reason = ?
         WHERE priest_id = ? AND order_id = ?
  `;

  await pool.execute(updatePoojaBookingQuery, [
    cancelReason,
    priestId,
    orderId,
  ]);

  return existingRows[0];
};
