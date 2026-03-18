import dotenv from "dotenv";

// const envFile = `.env.${process.env.ENVIRONMENT || "development"}`;


// dotenv.config({ path: envFile });
dotenv.config()

export default {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  ENVIRONMENT: process.env.ENVIRONMENT || "development",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_UNIQUE: process.env.JWT_UNIQUE,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  ENCRYPT_KEY: process.env.ENCRYPT_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  ALGORITHM: process.env.ALGORITHM || 'aes-256-cbc',
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
  ADMIN_REFRESH_JWT_SECRET: process.env.ADMIN_REFRESH_JWT_SECRET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || 'dummy-bucket-name',
  DEBUG: process.env.DEBUG === "true" || false,
  POOJA_LIVE_MODE_PRICE_PERCENTAGE:
    parseFloat(process.env.POOJA_LIVE_MODE_PRICE_PERCENTAGE) || 0.75,
  POOJA_RECORDED_MODE_PRICE_PERCENTAGE:
    parseFloat(process.env.POOJA_RECORDED_MODE_PRICE_PERCENTAGE) || 0.5,
  POOJA_ON_SITE_MODE_PRICE_PERCENTAGE:
    parseFloat(process.env.POOJA_ON_SITE_MODE_PRICE_PERCENTAGE) || 0.2,
  PRIEST_COMMISSION_PERCENTAGE:
    parseFloat(process.env.PRIEST_COMMISSION_PERCENTAGE) || 0.6,
  PRIEST_BONUS_COIN_PERCENTAGE:
    parseFloat(process.env.PRIEST_BONUS_COIN_PERCENTAGE) || 0.05,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  FRONTEND_DEVOTEE_URL: process.env.FRONTEND_DEVOTEE_URL,
  FRONTEND_PRIEST_URL: process.env.FRONTEND_PRIEST_URL,
};
