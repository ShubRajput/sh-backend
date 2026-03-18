import {
  addPriestIntroductionModel,
  checkIsUserPriestModel,
  createPriestModel,
  getExistingPriestDetailsModel,
  updatePriestProfileDetailsModel,
  uploadPriestProfileImageModel,
} from "../models/priest.model.js";

export const createPriestService = async (
  userId,
  religion,
  religion_id,
  phone_number,
  temple_id
) => {
  return await createPriestModel(userId, religion, religion_id, phone_number, temple_id);
};

export const uploadPriestProfileImageService = async (
  userId,
  profileImageUrl
) => {
  return await uploadPriestProfileImageModel(userId, profileImageUrl);
};

export const checkIsUserPriestService = async (userId) => {
  return await checkIsUserPriestModel(userId);
};

export const addPriestIntroductionService = async (userId, introduction) => {
  return await addPriestIntroductionModel(userId, introduction);
};

export const getExistingPriestDetailsService = async (userId) => {
  return await getExistingPriestDetailsModel(userId);
};

export const updatePriestProfileDetailsService = async (
  userId,
  userDetails
) => {
  return await updatePriestProfileDetailsModel(userId, userDetails);
};
