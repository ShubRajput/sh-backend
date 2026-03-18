import {
  creatUserDevoteeModel,
  deleteUserDevoteeByIdModel,
  getUserAllDevoteesByUserIdModel,
  updateUserDevoteeByIdModel,
} from "../models/user_devotee.model.js";

export const creatUserDevoteeService = async (userId, devoteeData) => {
  return await creatUserDevoteeModel(userId, devoteeData);
};

export const getUserAllDevoteesByUserIdService = async (userId) => {
  return await getUserAllDevoteesByUserIdModel(userId);
};

export const deleteUserDevoteeByIdService = async (userId, devoteeId) => {
  return await deleteUserDevoteeByIdModel(userId, devoteeId);
};

export const updateUserDevoteeByIdService = async (
  userId,
  devoteeId,
  devoteeData
) => {
  return await updateUserDevoteeByIdModel(userId, devoteeId, devoteeData);
};
