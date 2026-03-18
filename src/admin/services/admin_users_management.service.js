import {
  approveAdminModel,
  getAllUsersModel,
  getPendingAdminsModel,
  updateUserSuspendedStatusModel,
} from "../models/admin_users_management.models.js";

export const getAllUsersService = async () => {
  return await getAllUsersModel();
};

export const updateUserSuspendedStatusService = async (userId, isSuspended) => {
  return await updateUserSuspendedStatusModel(userId, isSuspended);
};

export const getPendingAdminsService = async () => {
  return await getPendingAdminsModel();
};

export const approveAdminService = async (adminId, is_approved) => {
  return await approveAdminModel(adminId, is_approved);
};
