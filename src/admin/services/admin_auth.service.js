import {
  adminSignUpModel,
  deleteSystemUserRefreshTokenModel,
  getAdminByIdModel,
  getAdminRefreshTokenModel,
  getExistAdminDetailsByEmailModel,
  saveSystemUserRefreshTokenModel,
  updateAdminPasswordModel,
} from "../models/admin_auth.model.js";

export const adminSignUpService = async (adminData) => {
  return await adminSignUpModel(adminData);
};

export const getExistAdminDetailsByEmailService = async (email) => {
  return await getExistAdminDetailsByEmailModel(email);
};

export const getAdminByIdService = async (adminId) => {
  return await getAdminByIdModel(adminId);
};

export const updateAdminPasswordService = async (adminId, hashedPassword) => {
  return await updateAdminPasswordModel(adminId, hashedPassword);
};

export const saveSystemUserRefreshTokenService = async (
  adminId,
  refreshToken,
  expiresIn
) => {
  return await saveSystemUserRefreshTokenModel(
    adminId,
    refreshToken,
    expiresIn
  );
};

export const deleteSystemUserRefreshTokenService = async (
  adminId,
  refreshToken
) => {
  return await deleteSystemUserRefreshTokenModel(adminId, refreshToken);
};

export const getAdminRefreshTokenService = async (adminId, refreshToken) => {
  return await getAdminRefreshTokenModel(adminId, refreshToken);
};
