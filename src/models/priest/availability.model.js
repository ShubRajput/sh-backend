import pool from "../../config/db.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";

export const upsertPriestAvailabilityModel = async (priestId, dataArray) => {
  // First, delete ALL existing records for this priest to ensure a clean slate
  const clearQuery = `DELETE FROM priest_availability WHERE priest_id = ?`;
  await pool.execute(clearQuery, [priestId]);

  // We expect dataArray to be an array of availability objects
  for (const data of dataArray) {
    const { temple_id, day_of_week, timings } = data;

    // Insert new timing slots
    if (timings && timings.length > 0) {
      for (const timing of timings) {
        const { from, to } = timing;
        const insertQuery = `
          INSERT INTO priest_availability (priest_id, temple_id, day_of_week, start_time, end_time) 
          VALUES (?, ?, ?, ?, ?)
        `;
        await pool.execute(insertQuery, [
          priestId,
          temple_id,
          day_of_week,
          from,
          to,
        ]);
      }
    }
  }
};

export const getPriestAvailabilityModel = async (priestId) => {
  const query = `
    SELECT pa.id, pa.day_of_week, pa.start_time, pa.end_time, pa.temple_id, t.temple_name 
    FROM priest_availability pa
    LEFT JOIN temples t ON pa.temple_id = t.id
    WHERE pa.priest_id = ?
    ORDER BY FIELD(pa.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), pa.start_time
  `;
  const [rows] = await pool.execute(query, [priestId]);

  // Group the flat rows into the nested timings format
  const formattedAvailability = [];
  const groupedData = {};

  for (const row of rows) {
    const key = `${row.temple_id}_${row.day_of_week}`;

    if (!groupedData[key]) {
      groupedData[key] = {
        temple_id: row.temple_id,
        temple_name: row.temple_name,
        day_of_week: row.day_of_week,
        timings: [],
      };
      formattedAvailability.push(groupedData[key]);
    }

    // Convert 18:00:00 to 18:00 to match the expected HH:MM format
    const formatTime = (timeStr) => {
      if (!timeStr) return timeStr;
      const parts = timeStr.split(':');
      return `${parts[0]}:${parts[1]}`;
    };

    groupedData[key].timings.push({
      id: row.id,
      from: formatTime(row.start_time),
      to: formatTime(row.end_time)
    });
  }

  return formattedAvailability;
};

export const addPriestUnavailabilityModel = async (priestId, data) => {
  const { start_date, end_date, reason } = data;

  const insertQuery = `
    INSERT INTO priest_unavailability (priest_id, start_date, end_date, reason) 
    VALUES (?, ?, ?, ?)
  `;
  await pool.execute(insertQuery, [
    priestId,
    start_date,
    end_date,
    reason || null,
  ]);
};

export const deletePriestUnavailabilityModel = async (priestId, unavailabilityId) => {
  const deleteQuery = `
    DELETE FROM priest_unavailability 
    WHERE id = ? AND priest_id = ?
  `;
  const [result] = await pool.execute(deleteQuery, [unavailabilityId, priestId]);

  if (result.affectedRows === 0) {
    throw new BadRequestError("Unavailability record not found or you don't have permission to delete it.");
  }
};

export const getPriestUnavailabilityModel = async (priestId) => {
  const query = `
    SELECT id, start_date, end_date, reason 
    FROM priest_unavailability 
    WHERE priest_id = ? 
    ORDER BY start_date DESC
  `;
  const [rows] = await pool.execute(query, [priestId]);
  return rows;
};
