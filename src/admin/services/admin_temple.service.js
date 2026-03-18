import {
  createNewTempleModel,
  deleteTempleByIdModel,
  getTempleByIdModel,
  getTempleDetailsByKeyModel,
  getTemplesDetailsModel,
  updateTempleByIdModel,
} from "../models/admin_temple.model.js";

export const createNewTempleService = async (templeData) => {
  return await createNewTempleModel(templeData);
};

export const getTemplesDetailsService = async (religionId) => {
  return await getTemplesDetailsModel(religionId);
};

export const deleteTempleByIdService = async (templeId) => {
  return await deleteTempleByIdModel(templeId);
};

export const getTempleByIdService = async (templeId) => {
  return await getTempleByIdModel(templeId);
};

export const getTempleDetailsByKeyService = async (templeKey) => {
  return await getTempleDetailsByKeyModel(templeKey);
};

export const updateTempleByIdService = async (templeId, templeData) => {
  return await updateTempleByIdModel(templeId, templeData);
};
