import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import envConfig from "../config/env.config.js";
import responseConstants from "../constants/response_const.js";
import {
  addUserBillingAddressService,
  assignUserRoleService,
  assignUserToVolunteerService,
  changePasswordService,
  checkUserExistsBillingAddressService,
  deleteUserEmailVerificationTokenService,
  findValidToken,
  getExistingUserDetailsByEmailService,
  getExistingUserDetailsService,
  getUserBillingAddressService,
  getUserEmailVerificationTokenService,
  resetUserPasswordService,
  saveResetTokenService,
  saveUserEmailVerificationTokenService,
  saveUserRefreshTokenService,
  sendPasswordResetEmailService,
  updateUserEmailVerificationStatusService,
  updateUserPhoneNumberService,
  updateUserProfileDetailsService,
  uploadUserProfileImageService,
  userSignUpService,
} from "../services/auth.service.js";
import { checkIsUserPriestService } from "../services/priest.service.js";
import { sendEmailVerificationEmail } from "../utils/email.utils.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";
import {
  generateAccessToken,
  generateRandomUniqueToken,
  generateRefreshToken,
  generateUniqueToken,
} from "../utils/token.util.js";
import {
  addUserBillingAddressValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  refreshTokenValidation,
  resetPasswordValidation,
  updateUserPhoneNumberValidation,
  updateUserProfileDetailsValidation,
  userSignInValidation,
  userSignUpValidation,
} from "../validations/auth.validation.js";

export const userSignUp = async (req, res, next) => {
  try {
    let reqBody = { ...req.body };

    const { error } = userSignUpValidation.validate(reqBody);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Hash the password before saving it
    reqBody.password = await bcrypt.hash(reqBody.password, 10);

    const user = await userSignUpService(reqBody);
    await assignUserRoleService(user.id);

    const emailVerificationToken = generateRandomUniqueToken();
    const expiredIn = 1; // 1 day

    await saveUserEmailVerificationTokenService(
      user.id,
      emailVerificationToken,
      expiredIn
    );

    try {
      await sendEmailVerificationEmail(user.email, emailVerificationToken);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }

    return res
      .status(201)
      .json({ status: 201, message: responseConstants.UserSignUpSuccess });
  } catch (error) {
    next(error);
  }
};

export const userSignIn = async (req, res, next) => {
  try {
    const reqBody = { ...req.body };

    const { error } = userSignInValidation.validate(reqBody);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const exsistingUser = await getExistingUserDetailsByEmailService(
      reqBody.email
    );

    if (!exsistingUser) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }

    if (exsistingUser.is_suspended) {
      throw new BadRequestError(responseConstants.UserSuspended);
    }

    if (exsistingUser.is_deactivated) {
      throw new BadRequestError(responseConstants.UserDeactivated);
    }

    const isPasswordValid = await bcrypt.compare(
      reqBody.password,
      exsistingUser.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError(responseConstants.InvalidUsernameOrPassword);
    }

    const accessToken = generateAccessToken({
      id: exsistingUser.id,
      email: exsistingUser.email,
      roles: exsistingUser.roles ? exsistingUser.roles.split(",") : [],
    });

    const refreshTokenExpiresIn = "30d"; // You can set this to any duration you want

    const refreshToken = generateRefreshToken(
      {
        id: exsistingUser.id,
        email: exsistingUser.email,
        roles: exsistingUser.roles ? exsistingUser.roles.split(",") : [],
      },
      refreshTokenExpiresIn
    );

    await saveUserRefreshTokenService(
      exsistingUser.id,
      refreshToken,
      refreshTokenExpiresIn.split("d")[0]
    );

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserSignInSuccess,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfileDetails = async (req, res, next) => {
  try {
    const body = { ...req.body };

    const { error } = updateUserProfileDetailsValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    await updateUserProfileDetailsService(req.user.id, body);

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserProfileDetailsUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await getExistingUserDetailsService(userId);

    if (!user) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserDetailsFetched,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserPhoneNumber = async (req, res, next) => {
  try {
    const body = { ...req.body };

    const { error } = updateUserPhoneNumberValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    await updateUserPhoneNumberService(req.user.id, body.phone_number);

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserProfileDetailsUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserBillingAddress = async (req, res, next) => {
  try {
    const body = { ...req.body };
    const userId = req.user.id;

    const { error } = addUserBillingAddressValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const isAlreadyBillingAddressAdded =
      await checkUserExistsBillingAddressService(userId);

    if (isAlreadyBillingAddressAdded) {
      throw new BadRequestError(
        "Billing address already exists for this user."
      );
    }

    await addUserBillingAddressService(userId, body);

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserBillingAddressAdded,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBillingAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const billingAddress = await getUserBillingAddressService(userId);

    if (!billingAddress) {
      throw new NotFoundError("Billing address not found for this user.");
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserBillingAddressRetrieved,
      data: billingAddress,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const reqBody = { ...req.body };

    const { error } = forgotPasswordValidation.validate(reqBody);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const exsistingUser = await getExistingUserDetailsByEmailService(
      reqBody.email
    );

    if (!exsistingUser) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }

    const resetToken = generateUniqueToken({
      id: exsistingUser.id,
      email: exsistingUser.email,
    });

    await saveResetTokenService(exsistingUser.id, resetToken);

    try {
      const type = reqBody.type;
      await sendPasswordResetEmailService(
        exsistingUser.email,
        resetToken,
        type
      );

      return res.status(200).json({
        status: 200,
        message: responseConstants.ForgotPasswordLinkSent,
      });
    } catch (emailError) {
      await saveResetTokenService(exsistingUser.id, null);
      throw new BadRequestError("Error sending reset email");
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const reqBody = { ...req.body };

    const { error } = resetPasswordValidation.validate(reqBody);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const token = await findValidToken(reqBody.token, reqBody.email);

    if (!token) {
      return res.status(403).json({
        status: 403,
        message: "Invalid or expired token.",
      });
    }

    const exsistingUser = await getExistingUserDetailsByEmailService(
      reqBody.email
    );

    if (!exsistingUser) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }

    reqBody.password = await bcrypt.hash(reqBody.password, 10);

    await resetUserPasswordService(exsistingUser.id, reqBody.password);

    return res.status(200).json({
      status: 200,
      message: responseConstants.PasswordReset,
    });
  } catch (error) {
    next(error);
  }
};

export const checkIsPriest = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await getExistingUserDetailsService(userId);

    if (!user) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }

    const isPriest = await checkIsUserPriestService(userId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserIsAPriest,
      data: { isPriest },
    });
  } catch (error) {
    next(error);
  }
};
export const uploadUserProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profilePicture = req.file;

    if (!profilePicture) {
      throw new BadRequestError("Profile picture is required.");
    }

    const url = profilePicture.location;

    await uploadUserProfileImageService(userId, url);

    return res.status(200).json({
      status: 200,
      message: "Profile picture uploaded successfully.",
      data: {
        userId,
        profilePicture: url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createVolunteer = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await assignUserToVolunteerService(userId);

    return res.status(201).json({
      status: 201,
      message: "User has successfully become a volunteer.",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword } = req.body;
    let { newPassword } = req.body;
    const userId = req.user.id;
    const email = req.user.email;

    const { error } = changePasswordValidation.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const exsistingUser = await getExistingUserDetailsByEmailService(email);

    if (!exsistingUser) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      exsistingUser.password
    );

    if (!isPasswordMatch) {
      throw new BadRequestError("Incorrect old password");
    }

    newPassword = await bcrypt.hash(newPassword, 10);

    await changePasswordService(userId, newPassword);

    return res.status(200).json({
      status: 200,
      message: responseConstants.PasswordChangedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    const { error } = refreshTokenValidation.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    let decoded;
    try {
      decoded = jwt.verify(refresh_token, envConfig.REFRESH_JWT_SECRET);
    } catch (err) {
      throw new BadRequestError("Invalid refresh token");
    }

    const accessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles || [],
    });

    return res.status(200).json({
      status: 200,
      message: responseConstants.TokenRefreshSuccess,
      data: {
        access_token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const baseUrl = envConfig.FRONTEND_DEVOTEE_URL;

    const existingToken = await getUserEmailVerificationTokenService(token);

    if (!token || !existingToken) {
      return res.status(400).send(
        `
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification Failed</title>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
      "
    >
      <h1 style="color: #bd803a">Email Verification Failed!</h1>
      <p>
        We're sorry, but we couldn't verify your email address.
      </p>
      <p>Invalid token or expired token. Please try again or contact support for assistance.</p>

      <a
        style="
          background-color: #bd803a;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin-top: 20px;
          cursor: pointer;
          border-radius: 5px;
        "
        href="${baseUrl}"
      >
        Go to Home
      </a>
    </div>
  </body>
</html>

        `
      );
    }

    if (existingToken) {
      await updateUserEmailVerificationStatusService(existingToken.user_id);
      await deleteUserEmailVerificationTokenService(token);
      return res.status(200).send(
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification Success</title>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
      "
    >
      <h1 style="color: #bd803a">Email Verification Successful!</h1>
      <p>
        Thank you for verifying your email address. You can now access all
        features of our application.
      </p>

      <a
        style="
          background-color: #bd803a;
          color: white;
          border: none;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin-top: 20px;
          cursor: pointer;
          border-radius: 5px;
        "
        href="${baseUrl}"
      >
        Go to Home
      </a>
    </div>
  </body>
</html>

        `
      );
    }
    return res.status(400).send("Invalid request");
  } catch (error) {
    next(error);
  }
};
