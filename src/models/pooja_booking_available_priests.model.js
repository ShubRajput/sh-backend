import pool from "../config/db.config.js";

export const getAvailablePriestsModel = async (templeId, poojaId, searchDate, searchTime) => {

    const query = `
    SELECT 
        u.id,
        u.user_name,
        u.profile_image_url,
        pr.introduction,
        pr.priest_location,
        pr.religion,
        ROUND(COALESCE(AVG(r.rate), 0), 1) AS average_rating,
        COUNT(r.id) AS total_reviews
    FROM users u
    JOIN priests pr ON pr.user_id = u.id
    JOIN pooja p ON p.id = ? 
    LEFT JOIN rating r ON r.priest_id = u.id
    WHERE 
        pr.religion_id = p.religion_id
        AND pr.temple_id = ?
        AND u.id NOT IN (
            SELECT priest_id FROM priest_unavailability 
            WHERE ? BETWEEN start_date AND end_date
            AND priest_id IS NOT NULL
        )
        AND u.id NOT IN (
            SELECT priest_id FROM pooja_bookings
            WHERE pooja_date = ? 
            AND (
              status IN ('pending', 'active') 
              OR (status = 'cancelled' AND priest_order_status = 'cancelled')
            )
            AND ? BETWEEN pooja_time AND ADDTIME(pooja_time, SEC_TO_TIME(duration_in_hours * 3600))
            AND priest_id IS NOT NULL
        )
    GROUP BY u.id, u.user_name, u.profile_image_url, pr.introduction, pr.priest_location, pr.religion
  `;

    // Provide parameters in the exact order
    const [rows] = await pool.execute(query, [
        poojaId,
        templeId,
        searchDate,
        searchDate,
        searchTime
    ]);

    return rows;
};
