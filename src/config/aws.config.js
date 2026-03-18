import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import envConfig from "./env.config.js";

export const s3 = new S3Client({
  region: envConfig.AWS_REGION,
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  },
});

export const S3_BUCKET_NAME = envConfig.AWS_BUCKET_NAME;

export const deleteFileFromS3 = async (s3Key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
    });
    return await s3.send(command);
  } catch (error) {
    throw error;
  }
};
