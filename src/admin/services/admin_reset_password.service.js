import bcrypt from "bcryptjs";
import {
  createResetPasswordModel,
  getResetPasswordByEmailModel,
  deleteResetPasswordModel,
  updateAdminPasswordModel,
} from "../models/admin_reset_password.model.js";
import { getExistAdminDetailsByEmailService } from "./admin_auth.service.js";
import { sendEmail } from "../../utils/email.utils.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPService = async (email) => {
  const admin = await getExistAdminDetailsByEmailService(email);

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (!admin.is_approved) {
    throw new Error("Admin account is not approved");
  }

  const otp = generateOTP();
  const encryptedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // after 15 minutes

  await createResetPasswordModel(email, encryptedOtp, expiresAt);

  const emailContent = {
    userId: email,
    subject: "Admin Password Reset OTP",
    message: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffffff; font-family: Arial, sans-serif;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffffff;">
          <tr>
            <td style="padding: 20px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="500" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #f8f8f8;">
                <tr>
                  <td style="padding: 20px 20px; text-align: center; background-color: #bd803a; border-radius: 8px 8px 0 0;">
                    <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                      Password Reset Request
                    </h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 20px;">
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #555; line-height: 1.5;">Hello,</p>

                    <p style="margin: 0 0 30px 0; font-size: 16px; color: #555; line-height: 1.5;">
                      You requested to reset your password. Please use the OTP below to proceed:
                    </p>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="text-align: center; padding: 20px 0;">
                          <div style="padding: 15px 25px; background-color: #f8f8f8; border-radius: 8px;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #bd803a;">
                              ${otp}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 20px 0 0 0; font-size: 14px; color: #777; line-height: 1.5;">
                      This OTP will expire in <strong>15 minutes</strong>.
                    </p>

                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #777; line-height: 1.5;">
                      If you did not request this reset, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px; background-color: #f8f8f8; text-align: center; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0; font-size: 12px; color: #aaa;">
                      © 2025 Soul Harmony. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await sendEmail(emailContent);

  return { message: "OTP sent successfully" };
};

export const verifyOTPService = async (email, otp) => {
  const resetRequest = await getResetPasswordByEmailModel(email);

  if (!resetRequest) {
    throw new Error("No valid reset request found or OTP expired");
  }

  const isOTPValid = await bcrypt.compare(otp, resetRequest.otp);

  if (!isOTPValid) {
    throw new Error("Invalid OTP");
  }

  return { message: "OTP verified successfully", email };
};

export const resetPasswordService = async (email, newPassword) => {
  const resetRequest = await getResetPasswordByEmailModel(email);

  if (!resetRequest) {
    throw new Error("No valid reset request found or session expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateAdminPasswordModel(email, hashedPassword);
  await deleteResetPasswordModel(email);

  return { message: "Password reset successfully" };
};

export const resendOTPService = async (email) => {
  return await sendOTPService(email);
};