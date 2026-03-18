import pool from "../../config/db.config.js";

export const createNewAdminOfferingModel = async (offeringData) => {
  const {
    offering_key,
    offering_name,
    offering_description,
    price,
    currency,
    religion_id,
    images_data,
  } = offeringData;
  const query = `
    INSERT INTO offerings (offering_key, offering_name, offering_description, price, currency, religion_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const imageInsertQuery = `
    INSERT INTO offerings_images (offering_id, image_url, image_type, s3_image_key)
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    offering_key,
    offering_name,
    offering_description,
    price,
    currency,
    religion_id,
  ];
  try {
    const result = await pool.query(query, values);
    const offeringId = result[0].insertId;

    if (images_data && images_data.length > 0) {
      for (const image of images_data) {
        await pool.execute(imageInsertQuery, [
          offeringId,
          image.image_url,
          image.image_type,
          image.s3_image_key,
        ]);
      }
    }
    return { ...offeringData, ...images_data };
  } catch (error) {
    throw error;
  }
};

export const getAllAdminOfferingsModel = async (religionId) => {
  const query = `
    SELECT
        o.*,
        CASE WHEN COUNT(oi.id) > 0 THEN JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', oi.id,
                'image_url', oi.image_url,
                'image_type', oi.image_type,
                's3_image_key', oi.s3_image_key
            )
        ) ELSE JSON_ARRAY()
        END AS images
    FROM offerings o
    LEFT JOIN offerings_images oi ON o.id = oi.offering_id
    WHERE o.religion_id = ?
    GROUP BY o.id
    `;

  const [rows] = await pool.execute(query, [religionId]);
  if (rows.length === 0) {
    return [];
  }
  if (rows.length > 0) {
    rows.forEach((row) => {
      if (row.images && typeof row.images === "string") {
        row.images = JSON.parse(row.images);
      }
    });
  }
  return rows;
};

export const deleteAdminOfferingByIdModel = async (offeringId) => {
  const query = `
    DELETE FROM offerings WHERE id = ?
  `;
  try {
    await pool.execute(query, [offeringId]);
    return { id: offeringId };
  } catch (error) {
    throw error;
  }
};

export const getAdminOfferingDetailsByIdModel = async (offeringId) => {
  const query = `
    SELECT
        o.*,
        CASE WHEN COUNT(oi.id) > 0 THEN JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', oi.id,
                'image_url', oi.image_url,
                'image_type', oi.image_type,
                's3_image_key', oi.s3_image_key
            )
        ) ELSE JSON_ARRAY()
        END AS images
    FROM offerings o
    LEFT JOIN offerings_images oi ON o.id = oi.offering_id
    WHERE o.id = ?
    GROUP BY o.id
  `;
  const [rows] = await pool.execute(query, [offeringId]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

export const updateAdminOfferingByIdModel = async (
  offeringId,
  offeringData
) => {
  const { offering_name, offering_description, price, currency } = offeringData;

  const query = `
    UPDATE offerings
    SET offering_name = ?, offering_description = ?, price = ?, currency = ?
    WHERE id = ?
  `;

  const values = [
    offering_name,
    offering_description,
    price,
    currency,
    offeringId,
  ];

  await pool.execute(query, values);
  return { id: offeringId, ...offeringData };
};

export const deleteAdminOfferingImagebyIdModel = async (imageId) => {
  const query = `
    DELETE FROM offerings_images WHERE id = ?
  `;
  try {
    const [result] = await pool.execute(query, [imageId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

export const getExistingAdminOfferingImageDetailsByIdModel = async (
  imageId
) => {
  const query = `
    SELECT * FROM offerings_images WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [imageId]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

export const uploadAdminOfferingImageModel = async (imageData) => {
  const query = `
    INSERT INTO offerings_images (offering_id, image_url, image_type, s3_image_key)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    imageData.offering_id,
    imageData.image_url,
    imageData.image_type,
    imageData.s3_image_key,
  ];
  try {
    const [result] = await pool.execute(query, values);
    return { id: result.insertId, ...imageData };
  } catch (error) {
    throw error;
  }
};

export const getAdminOfferingImageDetailsByOfferingIdAndImageTypeModel = async (
  offeringId,
  imageType
) => {
  const query = `
    SELECT * FROM offerings_images WHERE offering_id = ? AND image_type = ?
  `;
  const [rows] = await pool.execute(query, [offeringId, imageType]);
  if (rows.length === 0) {
    return null;
  }
  return rows;
};

export const getOfferingsFinancialDetailsModel = async (religionId, period) => {
  let baseQuery = `
  SELECT
  uo.*,
  u.user_name,
  IF(t.id IS NOT NULL,
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
  IF(COUNT(uoi.id ) > 0,
        JSON_ARRAYAGG(
           JSON_OBJECT(
            'id', uoi.id,
            'item_name', uoi.item_name,
            'quantity', uoi.quantity,
            'total_price', uoi.price,
            'unit_price', o.price
            )
        ),
        JSON_ARRAY()
      ) AS offering_items
  FROM user_offerings uo
  LEFT JOIN users u ON uo.user_id = u.id
  LEFT JOIN temples t ON uo.temple_id = t.id
  LEFT JOIN user_offerings_items uoi ON uo.id = uoi.user_offering_id
  LEFT JOIN offerings o ON uoi.offering_id = o.id
  WHERE uo.payment_status = 'completed' 
  `;
  const queryParams = [];

  if (religionId) {
    baseQuery += `AND uo.religion_id = ?`;
    queryParams.push(religionId);
  }

  if (period) {
    if (period === "today") {
      baseQuery += ` AND DATE(uo.offer_submitted_date) = CURDATE()`;
    } else if (period === "month") {
      baseQuery += ` AND MONTH(uo.offer_submitted_date) = MONTH(CURDATE()) AND YEAR(uo.offer_submitted_date) = YEAR(CURDATE())`;
    } else if (period === "year") {
      baseQuery += ` AND YEAR(uo.offer_submitted_date) = YEAR(CURDATE())`;
    }
  }

  baseQuery += ` GROUP BY uo.id`;

  const [rows] = await pool.execute(baseQuery, queryParams);
  if (rows.length > 0) {
    rows.forEach((row) => {
      if (row.temple_details && typeof row.temple_details === "string") {
        row.temple_details = JSON.parse(row.temple_details);
      }
      if (row.offering_items && typeof row.offering_items === "string") {
        row.offering_items = JSON.parse(row.offering_items);
      }
    });
  }
  return {
    religion_id: religionId || null,
    period: period || "all",
    financial_details: rows,
  };
};
