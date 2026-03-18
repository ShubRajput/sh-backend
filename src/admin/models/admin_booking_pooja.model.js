import pool from '../../config/db.config.js';

export const getAllBookingsDetailsModel = async () => {
  const query = `
    SELECT
        pb.*,

        -- Temple details
        JSON_OBJECT(
            'id', t.id,
            'temple_key', t.temple_key,
            'temple_name', t.temple_name,
            'temple_description', t.temple_description,
            'location', t.location,
            'image_url', t.image_url
        ) AS temple_details,

        -- User details
        JSON_OBJECT(
            'id', u.id,
            'user_name', u.user_name,
            'profile_image_url', u.profile_image_url
        ) AS user_details,

        -- Pooja details
        JSON_OBJECT(
            'id', p.id,
            'pooja_key', p.pooja_key,
            'pooja_name',p.pooja_name,
            'pooja_description', p.pooja_description,
            'image_url', p.image_url
        ) as pooja_details,

        -- Souvernirs details
        CASE WHEN COUNT(s.id) > 0 THEN
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', s.id,
                    'souv_key', s.souv_key,
                    'souv_name', s.souv_name,
                    'souv_description', s.souv_description,
                    'image_url', s.image_url
                )
            ) 
        ELSE JSON_ARRAY()
        END AS souvenirs_details,
        
        -- Priest details
        CASE WHEN priestUser.id IS NOT NULL THEN
        JSON_OBJECT(
            'id', priestUser.id,
            'user_name', priestUser.user_name,
            'profile_image_url', priestUser.profile_image_url
        ) ELSE NULL 
        END AS priest_details

    FROM
        pooja_bookings pb
    INNER JOIN users u ON pb.user_id = u.id
    LEFT JOIN users priestUser ON pb.priest_id = priestUser.id
    INNER JOIN temples t ON pb.temple_id = t.id
    INNER JOIN pooja p ON pb.pooja_id = p.id
    LEFT JOIN priests pr ON pb.priest_id = pr.user_id
    LEFT JOIN pooja_booking_souvernirs pbs ON pb.id = pbs.booking_id
    LEFT JOIN souvernirs s ON pbs.souv_id = s.id
    GROUP BY pb.id, t.id, p.id, u.id
  `;

  try {
    const [rows] = await pool.execute(query);

    return rows;
  } catch (error) {
    throw error;
  }
};
