import {
  createNewPoojaModel,
  deletePoojaByIdModel,
  getAllPoojasModel,
  getPoojaByKeyModel,
  getPoojaDetailsByIdModel,
  updatePoojaByIdModel,
} from "../../admin/models/admin_pooja.model.js";

export const createNewPoojaService = async (poojaData) => {
  return await createNewPoojaModel(poojaData);
};

export const getAllPoojasService = async (religionId) => {
  return await getAllPoojasModel(religionId);
};

export const deletePoojaByIdService = async (poojaId) => {
  return await deletePoojaByIdModel(poojaId);
};

export const updatePoojaByIdService = async (poojaId, poojaData) => {
  return await updatePoojaByIdModel(poojaId, poojaData);
};

export const getPoojaDetailsByIdService = async (poojaId) => {
  return await getPoojaDetailsByIdModel(poojaId);
};

export const getPoojaByKeyService = async (poojaKey) => {
  return await getPoojaByKeyModel(poojaKey);
};
