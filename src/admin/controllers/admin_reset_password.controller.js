import AdminResponseConst from "../constants/admin_response_const.js";
import {
  sendOTPService,
  verifyOTPService,
  resetPasswordService,
  resendOTPService,
} from "../services/admin_reset_password.service.js";
import {
  sendOTPValidation,
  verifyOTPValidation,
  resetPasswordValidation,
} from "../validations/admin_reset_password.validation.js";

export const sendOTP = async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = sendOTPValidation.validate(body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { email } = body;
    const result = await sendOTPService(email);

    return res.status(200).json({
      status: 200,
      message: result.message,
    });
  } catch (error) {
    if (error.message === "Admin not found" || error.message === "Admin account is not approved") {
      return res.status(404).json({
        status: 404,
        message: error.message,
      });
    }
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = verifyOTPValidation.validate(body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { email, otp } = body;
    const result = await verifyOTPService(email, otp);

    return res.status(200).json({
      status: 200,
      message: result.message,
      data: {
        email: result.email,
      },
    });
  } catch (error) {
    if (error.message === "No valid reset request found or OTP expired" ||
        error.message === "Invalid OTP") {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = resetPasswordValidation.validate(body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { email, newPassword } = body;
    const result = await resetPasswordService(email, newPassword);

    return res.status(200).json({
      status: 200,
      message: result.message,
    });
  } catch (error) {
    if (error.message === "No valid reset request found or session expired") {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = sendOTPValidation.validate(body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { email } = body;
    const result = await resendOTPService(email);

    return res.status(200).json({
      status: 200,
      message: "OTP resent successfully",
    });
  } catch (error) {
    if (error.message === "Admin not found" || error.message === "Admin account is not approved") {
      return res.status(404).json({
        status: 404,
        message: error.message,
      });
    }
    next(error);
  }
};