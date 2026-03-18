import multer from "multer";
import multerS3 from "multer-s3";

import { s3, S3_BUCKET_NAME } from "../config/aws.config.js";

export const createS3Uploader = (folderName, options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    maxFiles = 1,
  } = options;

  return multer({
    limit: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
    storage: multerS3({
      s3: s3,
      bucket: S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        // Store original filename and upload date in metadata
        cb(null, {
          originalName: file.originalname,
          uploadDate: new Date().toISOString(),
          mimeType: file.mimetype,
        });
      },
      key: (req, file, cb) => {
        const fileName = `${folderName}/${Date.now()}-${file.originalname}`;
        cb(null, fileName);
      },
    }),
  });
};
