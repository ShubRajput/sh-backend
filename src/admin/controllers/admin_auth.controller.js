import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import envConfig from "../../config/env.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import AdminResponseConst from "../constants/admin_response_const.js";
import {
  adminSignUpService,
  deleteSystemUserRefreshTokenService,
  getAdminByIdService,
  getAdminRefreshTokenService,
  getExistAdminDetailsByEmailService,
  saveSystemUserRefreshTokenService,
  updateAdminPasswordService,
} from "../services/admin_auth.service.js";
import {
  generateAdminAccessToken,
  generateAdminRefreshToken,
} from "../utils/admin_token.util.js";
import {
  adminChangePasswordValidation,
  adminSignInValidation,
  adminSignUpValidation,
  refreshAdminTokenValidation,
} from "../validations/admin_auth.validation.js";

export const adminSignUp = async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = adminSignUpValidation.validate(body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    body.password = await bcrypt.hash(body.password, 10);

    const adminData = {
      user_name: body.user_name,
      email: body.email,
      password: body.password,
    };

    await adminSignUpService(adminData);

    return res.status(201).json({
      status: 201,
      message: AdminResponseConst.AdminSignupSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const adminSignIn = async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = adminSignInValidation.validate(body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { email, password } = body;

    const admin = await getExistAdminDetailsByEmailService(email);
    if (!admin) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConst.AdminNotFound,
      });
    }

    if (!admin.is_approved) {
      return res.status(403).json({
        status: 403,
        message: AdminResponseConst.AdminNotApproved,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        message: AdminResponseConst.InvalidCredentials,
      });
    }

    const accessToken = generateAdminAccessToken({
      id: admin.id,
      email: admin.email,
      roles: admin.roles ? admin.roles.split(",") : [],
    });

    const refreshTokenExpiresIn = "30d";
    const refreshToken = generateAdminRefreshToken(
      {
        id: admin.id,
        email: admin.email,
        roles: admin.roles ? admin.roles.split(",") : [],
      },
      refreshTokenExpiresIn
    );

    await saveSystemUserRefreshTokenService(
      admin.id,
      refreshToken,
      refreshTokenExpiresIn.split("d")[0]
    );

    return res.status(200).json({
      status: 200,
      message: AdminResponseConst.AdminSignInSuccessfully,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminChangePassword = async (req, res, next) => {
  try {
    const body = req.body;
    const adminId = req.admin.id;

    const { error } = adminChangePasswordValidation.validate(body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { currentPassword, newPassword } = body;

    const admin = await getAdminByIdService(adminId);
    if (!admin) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConst.AdminNotFound,
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 400,
        message: AdminResponseConst.CurrentPasswordIncorrect,
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updateResult = await updateAdminPasswordService(
      adminId,
      hashedNewPassword
    );
    if (!updateResult) {
      return res.status(500).json({
        status: 500,
        message: "Failed to update password",
      });
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConst.PasswordChangedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAdminAccessToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const { error } = refreshAdminTokenValidation.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    let decoded;
    try {
      decoded = jwt.verify(refresh_token, envConfig.ADMIN_REFRESH_JWT_SECRET);
    } catch (err) {
      throw new BadRequestError("Invalid refresh token");
    }

    const admin = await getExistAdminDetailsByEmailService(decoded.email);
    if (!admin) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConst.AdminNotFound,
      });
    }

    if (!admin.is_approved) {
      return res.status(403).json({
        status: 403,
        message: AdminResponseConst.AdminNotApproved,
      });
    }

    const accessToken = generateAdminAccessToken({
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,
    });

    const storedToken = await getAdminRefreshTokenService(
      decoded.id,
      refresh_token
    );

    if (!storedToken) {
      throw new BadRequestError("Refresh token not found or already used");
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConst.AccessTokenRefreshedSuccessfully,
      data: {
        access_token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminSignOut = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const { refresh_token } = req.body;

    const { error } = refreshAdminTokenValidation.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const result = await deleteSystemUserRefreshTokenService(
      adminId,
      refresh_token
    );

    if (!result) {
      return res.status(400).json({
        status: 400,
        message: AdminResponseConst.FailedToSignOut,
      });
    }
    return res.status(200).json({
      status: 200,
      message: AdminResponseConst.AdminSignOutSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};
