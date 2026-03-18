import {
  createSouvernirModel,
  deleteSouvernirByIdModel,
  getAllSouvernirsModel,
  getSouvernirByIdModel,
  getSouvernirDetailsByKeyModel,
  updateSouvernirByIdModel,
} from "../models/admin_souvernir.model.js";

export const createSouvernirService = async (souvernirData) => {
  return await createSouvernirModel(souvernirData);
};

export const getAllSouvernirsService = async (religionId) => {
  return await getAllSouvernirsModel(religionId);
};

export const deleteSouvernirByIdService = async (souvernirId) => {
  return await deleteSouvernirByIdModel(souvernirId);
};

export const updateSouvernirByIdService = async (souvernirId, souvData) => {
  return await updateSouvernirByIdModel(souvernirId, souvData);
};

export const getSouvernirByIdService = async (souvernirId) => {
  return await getSouvernirByIdModel(souvernirId);
};

export const getSouvernirDetailsByKeyService = async (souvernirKey) => {
  return await getSouvernirDetailsByKeyModel(souvernirKey);
};
