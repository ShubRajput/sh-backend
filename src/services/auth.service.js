import envConfig from "../config/env.config.js";
import {
  addUserBillingAddressModel,
  assignUserRoleModel,
  assignUserToPreistModel,
  assignUserToVolunteerModel,
  changePasswordModel,
  checkUserExistsBillingAddressModel,
  deleteUserEmailVerificationTokenModel,
  findValidTokenModel,
  getExistingUserDetailsByEmailModel,
  getExistingUserDetailsModel,
  getUserBillingAddressModel,
  getUserEmailVerificationTokenModel,
  saveResetTokenModel,
  saveUserEmailVerificationTokenModel,
  saveUserRefreshTokenModel,
  updateNewUserPasswordModel,
  updateUserEmailVerificationStatusModel,
  updateUserPhoneNumberModel,
  updateUserProfileDetailsModel,
  uploadUserProfileImageModel,
  userSignUpModel,
} from "../models/user.model.js";
import { sendEmail } from "../utils/email.utils.js";

export const userSignUpService = async (userData) => {
  return await userSignUpModel(userData);
};

export const getExistingUserDetailsService = async (userId) => {
  return await getExistingUserDetailsModel(userId);
};

export const getExistingUserDetailsByEmailService = async (email) => {
  return await getExistingUserDetailsByEmailModel(email);
};

export const updateUserProfileDetailsService = async (userId, userDetails) => {
  return await updateUserProfileDetailsModel(userId, userDetails);
};

export const updateUserPhoneNumberService = async (userId, phone_number) => {
  return await updateUserPhoneNumberModel(userId, phone_number);
};

export const checkUserExistsBillingAddressService = async (userId) => {
  return await checkUserExistsBillingAddressModel(userId);
};

export const addUserBillingAddressService = async (userId, billingAddress) => {
  return await addUserBillingAddressModel(userId, billingAddress);
};

export const getUserBillingAddressService = async (userId) => {
  return await getUserBillingAddressModel(userId);
};

export const saveResetTokenService = async (userId, token) => {
  return await saveResetTokenModel(userId, token);
};

export const sendPasswordResetEmailService = async (userId, token, type) => {
  let baseUrl;
  if (type === "priest") {
    baseUrl = envConfig.FRONTEND_PRIEST_URL;
  } else if (type === "user") {
    baseUrl = envConfig.FRONTEND_DEVOTEE_URL;
  }
  const url = `${baseUrl}/reset-password?token=${token}`;
  const message = `<p>Please click on the link to reset your password</p><a href="${url}">${url}</a>`;

  await sendEmail({
    userId: userId,
    subject: "Reset your password",
    message: message,
  });
};

export const findValidToken = async (token, userId) => {
  return findValidTokenModel(token, userId);
};

export const resetUserPasswordService = async (userId, newPassword) => {
  return await updateNewUserPasswordModel(userId, newPassword);
};

export const assignUserRoleService = async (userId) => {
  return await assignUserRoleModel(userId);
};

export const assignUserToPreistService = async (userId) => {
  return await assignUserToPreistModel(userId);
};

export const assignUserToVolunteerService = async (userId) => {
  return await assignUserToVolunteerModel(userId);
};

export const uploadUserProfileImageService = async (
  userId,
  profileImageUrl
) => {
  return await uploadUserProfileImageModel(userId, profileImageUrl);
};

export const changePasswordService = async (userId, newPassword) => {
  return await changePasswordModel(userId, newPassword);
};

export const saveUserRefreshTokenService = async (
  userId,
  refreshToken,
  expiresIn
) => {
  return await saveUserRefreshTokenModel(userId, refreshToken, expiresIn);
};

export const saveUserEmailVerificationTokenService = async (
  userId,
  emailVerificationToken,
  expiresIn
) => {
  return await saveUserEmailVerificationTokenModel(
    userId,
    emailVerificationToken,
    expiresIn
  );
};

export const getUserEmailVerificationTokenService = async (token) => {
  return await getUserEmailVerificationTokenModel(token);
};

export const deleteUserEmailVerificationTokenService = async (token) => {
  return await deleteUserEmailVerificationTokenModel(token);
};

export const updateUserEmailVerificationStatusService = async (userId) => {
  return await updateUserEmailVerificationStatusModel(userId);
};
