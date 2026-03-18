import pool from "../../config/db.config.js";

export const getAllPriestsModel = async (religionId) => {
  let query = `
   SELECT
    -- User related info
        u.id,
        u.user_name,
        u.email,
        u.date_of_birth,
        u.maritial_state,
        u.nationality,
        u.gotra,
        u.phone_number,
        u.is_email_verified,
        u.profile_image_url,
        u.is_suspended,
        u.is_deactivated,
    
    -- Priest related info
        p.priest_location,
        p.religion,
        p.introduction,

    -- Rating related info
       -- ROUND(COALESCE(AVG(rating.rate), 0), 1) as average_rating,
       CAST(COALESCE(AVG(rating.rate), 0) AS DECIMAL(3,1)) as average_rating, 
       COUNT(rating.id) as total_reviews,

    -- Payment related info
       JSON_OBJECT(
        'account_holder_name', pd.account_holder_name,
        'bank_name', pd.bank_name,
        'branch_name', pd.branch_name,
        'account_number', pd.account_number,
        'created_at', pd.created_at,
        'updated_at', pd.updated_at
    ) as payment_details


    FROM users u
    INNER JOIN priests p ON u.id = p.user_id
    LEFT JOIN rating rating ON u.id=rating.priest_id
    LEFT JOIN payment_details pd ON u.id = pd.priest_id
    
 `;

  const params = [];
  if (religionId) {
    query += ` WHERE p.religion_id = ? `;
    params.push(religionId);
  }

  query += `GROUP BY u.id,pd.id`;

  try {
    const [rows] = await pool.execute(query, params);

    if (rows.length > 0) {
      rows.forEach((row) => {
        if (row.payment_details && typeof row.payment_details === "string") {
          row.payment_details = JSON.parse(row.payment_details);
        }
      });
    }

    return rows;
  } catch (error) {
    throw error;
  }
};

export const getPriestRatingDetailsByIdModel = async (priestId) => {
  const query = `
    SELECT
        rating.id,
        u.user_name,
        u.profile_image_url,
        rating.rate,
        rating.review,
        rating.comment,
        rating.created_at,
        IF(pb.id IS NOT NULL,
            JSON_OBJECT(
                'id', pb.id,
                'pooja_name', pb.pooja_name
            ), NULL) 
        AS pooja_booking_details
    FROM rating rating
    LEFT JOIN users u ON u.id = rating.user_id
    LEFT JOIN users priests ON priests.id = rating.priest_id
    LEFT JOIN pooja_bookings pb ON rating.pooja_booking_id = pb.id
    WHERE priests.id = ?
  `;

  try {
    const [rows] = await pool.execute(query, [priestId]);

    return rows;
  } catch (error) {
    throw error;
  }
};

export const getPriestAcceptedPoojaBookingsByPriestIdModel = async (
  priestId
) => {
  try {
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
        pb.created_at, 
        pb.updated_at
    FROM pooja_bookings AS pb
    LEFT JOIN temples AS t ON pb.temple_id = t.id
    LEFT JOIN pooja AS p ON pb.pooja_id = p.id
    LEFT JOIN users AS u2 ON pb.user_id = u2.id
    WHERE pb.priest_id = ? AND pb.priest_order_status = 'active' AND pb.user_order_status = 'active' AND pb.payment_status = 'completed'
    GROUP BY pb.id
    ORDER BY pb.created_at DESC
    `;

    const [rows] = await pool.execute(query, [priestId]);
    if (rows.length === 0) {
      return [];
    }

    if (rows.length > 0) {
      rows.forEach((row) => {
        if (row.temple_details && typeof row.temple_details === "string") {
          row.temple_details = JSON.parse(row.temple_details);
        }

        if (row.pooja_details && typeof row.pooja_details === "string") {
          row.pooja_details = JSON.parse(row.pooja_details);
        }
      });
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getPriestsEarningDetailsModel = async (religionId, period) => {
  try {
    //! Base Query
    let query = `
    SELECT
         u.id AS priest_id,
         u.user_name AS priest_name,
         COUNT(pe.id) AS total_requests,
         SUM(pe.earning_amount) AS total_earnings,
         SUM(pe.bonus_coin) AS total_bonus_coins
    FROM priests_earnings pe
    LEFT JOIN users u ON pe.priest_id = u.id
    LEFT JOIN priests p ON u.id = p.user_id
  `;

    const queryParams = [];

    if (religionId) {
      query += ` WHERE p.religion_id = ? `;
      queryParams.push(religionId);
    }

    if (period) {
      const normalizedPeriod = period.trim().toLowerCase();
      if (normalizedPeriod === "today") {
        query += queryParams.length > 0 ? ` AND ` : ` WHERE `;
        query += ` DATE(pe.created_at) = CURDATE() `;
      } else if (normalizedPeriod === "month") {
        query += queryParams.length > 0 ? ` AND ` : ` WHERE `;
        query += ` MONTH(pe.created_at) = MONTH(CURDATE()) AND YEAR(pe.created_at) = YEAR(CURDATE()) `;
      } else if (normalizedPeriod === "year") {
        query += queryParams.length > 0 ? ` AND ` : ` WHERE `;
        query += ` YEAR(pe.created_at) = YEAR(CURDATE()) `;
      }
    }

    const groupbyClause = "GROUP BY pe.priest_id";
    query += ` ${groupbyClause} `;

    query += ` ORDER BY total_earnings DESC `;

    const [rows] = await pool.execute(query, queryParams);
    return {
      period: period || "all",
      religion_id: religionId || null,
      earnings_data: rows,
    };
  } catch (error) {
    throw error;
  }
};

export const getPriestCompletedPoojaBookingsModel = async (priestId) => {
  try {
    const query = `
    SELECT
      pe.*,
      pb.pooja_name,
      u.user_name AS devotee_name,
      pb.pooja_date,
      pb.pooja_time,
      pb.duration_in_hours,
      pb.order_id,
      pb.additional_note
    FROM priests_earnings pe
    LEFT JOIN pooja_bookings pb ON pe.booking_id = pb.id
    LEFT JOIN users u ON pb.user_id = u.id
    WHERE pe.priest_id = ?
  `;

    const [rows] = await pool.execute(query, [priestId]);
    return rows;
  } catch (error) {
    throw error;
  }
};
