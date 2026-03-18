import pool from '../../config/db.config.js';
import { BadRequestError } from '../../utils/errors.utils.js';

export const createNewReligionModel = async (religionData) => {
  const {
    religion_key,
    religion_name,
    religion_description,
    hover_description,
    sanctuary_name,
    feature_name,
    // images_data,
  } = religionData;

  const alreadyExistQuery = `
    SELECT * FROM religions WHERE religion_key = ?
  `;

  const alreadyExistQueryValues = [religion_key];

  const insertQuery = `
    INSERT INTO religions (religion_key, religion_name, religion_description, hover_description, sanctuary_name, feature_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // const insertImagesQuery = `
  //   INSERT INTO religions_images (religion_id, image_url,image_type, s3_image_key)
  //   VALUES (?, ?, ?, ?)
  // `;

  const insertQueryValues = [
    religion_key,
    religion_name,
    religion_description || null,
    hover_description || null,
    sanctuary_name || null,
    feature_name || null,
  ];

  const [existing] = await pool.execute(
    alreadyExistQuery,
    alreadyExistQueryValues
  );
  if (existing.length > 0) {
    throw new BadRequestError("Religion already exists");
  }

  const [result] = await pool.execute(insertQuery, insertQueryValues);

  const religionId = result.insertId;

  // if (images_data && images_data.length > 0) {
  //   for (const image of images_data) {
  //     await pool.execute(insertImagesQuery, [
  //       religionId,
  //       image.image_url,
  //       image.image_type,
  //       image.s3_image_key,
  //     ]);
  //   }
  // }

  return {
    id: religionId,
    ...religionData,
    // ...images_data,
  };
};

export const getAllReligionsModel = async () => {
  //!Get details with images
  // const query = `
  //       SELECT r.*,
  //         CASE WHEN COUNT(ri.id) > 0 THEN JSON_ARRAYAGG(
  //           JSON_OBJECT(
  //             'image_url', ri.image_url,
  //             'image_type', ri.image_type,
  //             's3_image_key', ri.s3_image_key
  //           )
  //         ) ELSE JSON_ARRAY()
  //         END AS images
  //       FROM religions r
  //       LEFT JOIN religions_images ri ON r.id = ri.religion_id
  //       GROUP BY r.id
  //   `;

  const query = `
        SELECT r.*
        FROM religions r
    `;

  const [results] = await pool.execute(query);
  return results;
};

export const getReligionByKeyModel = async (religionKey) => {
  const query = `
      SELECT r.*,
        CASE WHEN COUNT(ri.id) > 0 THEN JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ri.id,
              'image_url', ri.image_url,
              'image_type', ri.image_type,
              's3_image_key', ri.s3_image_key
            )
          ) ELSE JSON_ARRAY()
          END AS images
        FROM religions r
        LEFT JOIN religions_images ri ON r.id = ri.religion_id
        WHERE r.religion_key = ?
        GROUP BY r.id
    `;

  const [results] = await pool.execute(query, [religionKey]);
  if (results.length > 0 && typeof results[0].images === "string") {
    results[0].images = JSON.parse(results[0].images);
  }
  return results[0];
};

export const deleteReligionByKeyModel = async (religionKey) => {
  const query = `
        DELETE FROM religions WHERE religion_key = ?
    `;

  const [result] = await pool.execute(query, [religionKey]);
  return result.affectedRows > 0;
};

export const updateReligionByKeyModel = async (religionKey, updatedData) => {
  const {
    religion_name,
    religion_description,
    hover_description,
    sanctuary_name,
    feature_name,
  } = updatedData;

  const query = `
        UPDATE religions
        SET religion_name = ?, religion_description = ?, hover_description = ?, sanctuary_name = ?, feature_name = ?
        WHERE religion_key = ?
    `;

  const [result] = await pool.execute(query, [
    religion_name,
    religion_description || null,
    hover_description || null,
    sanctuary_name || null,
    feature_name || null,
    religionKey,
  ]);
  return result.affectedRows > 0;
};

export const deleteReligionImageByIdModel = async (imageId) => {
  const query = `
        DELETE FROM religions_images WHERE id = ?
    `;

  const [result] = await pool.execute(query, [imageId]);
  return result.affectedRows > 0;
};

export const getExistingImageDetailsByIdModel = async (imageId) => {
  const query = `
        SELECT * FROM religions_images WHERE id = ?
    `;

  const [results] = await pool.execute(query, [imageId]);
  return results[0];
};

export const checkReligionExistingHoverImageStatusModel = async (
  religionId
) => {
  const query = `
        SELECT * FROM religions_images WHERE religion_id = ? AND image_type = 'hover'
    `;

  const [results] = await pool.execute(query, [religionId]);
  return results.length > 0;
};

export const checkReligionExistingDescriptionImagesCountModel = async (
  religionId
) => {
  const query = `
        SELECT COUNT(*) as count FROM religions_images WHERE religion_id = ? AND image_type = 'description'
    `;

  const [results] = await pool.execute(query, [religionId]);
  return results[0].count;
};

export const addNewReligionImagesModel = async (religionId, imagesData) => {
  const { images } = imagesData;
  if (!images || images.length === 0) {
    throw new BadRequestError("No images data provided");
  }

  const insertImagesQuery = `
        INSERT INTO religions_images (religion_id, image_url, image_type, s3_image_key)
        VALUES (?, ?, ?, ?)
    `;

  for (const image of images) {
    await pool.execute(insertImagesQuery, [
      religionId,
      image.image_url,
      image.image_type,
      image.s3_image_key,
    ]);
  }

  return {
    religion_id: religionId,
    images: images,
  };
};
