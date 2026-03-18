import {
  createBankModel,
  deleteBankByIdModel,
  getAllBanksModel,
} from "../models/admin_banks.model.js";

export const createBankService = async (bank_name, bank_code) => {
  return await createBankModel(bank_name, bank_code);
};

export const getAllBanksService = async () => {
  return await getAllBanksModel();
};

export const deleteBankByIdService = async (id) => {
  return await deleteBankByIdModel(id);
};
