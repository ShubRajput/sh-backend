import {
  addNewReligionImagesModel,
  checkReligionExistingDescriptionImagesCountModel,
  checkReligionExistingHoverImageStatusModel,
  createNewReligionModel,
  deleteReligionByKeyModel,
  deleteReligionImageByIdModel,
  getAllReligionsModel,
  getExistingImageDetailsByIdModel,
  getReligionByKeyModel,
  updateReligionByKeyModel,
} from "../models/admin_religion.model.js";

export const createNewReligionService = async (religionData) => {
  return await createNewReligionModel(religionData);
};

export const getAllReligionsService = async () => {
  return await getAllReligionsModel();
};

export const getReligionByKeyService = async (religionKey) => {
  return await getReligionByKeyModel(religionKey);
};

export const deleteReligionByKeyService = async (religionKey) => {
  return await deleteReligionByKeyModel(religionKey);
};

export const updateReligionByKeyService = async (religionKey, updatedData) => {
  return await updateReligionByKeyModel(religionKey, updatedData);
};

export const deleteReligionImageByIdService = async (imageId) => {
  return await deleteReligionImageByIdModel(imageId);
};

export const getExistingImageDetailsByIdService = async (imageId) => {
  return await getExistingImageDetailsByIdModel(imageId);
};

export const checkReligionExistingHoverImageStatusService = async (
  religionKey
) => {
  return await checkReligionExistingHoverImageStatusModel(religionKey);
};

export const checkReligionExistingDescriptionImagesCountService = async (
  religionKey
) => {
  return await checkReligionExistingDescriptionImagesCountModel(religionKey);
};

export const addNewReligionImagesService = async (religionId, imagesData) => {
  return await addNewReligionImagesModel(religionId, imagesData);
};
