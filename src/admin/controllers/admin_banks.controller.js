import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import {
  createBankService,
  deleteBankByIdService,
  getAllBanksService,
} from "../services/admin_banks.service.js";
import { createBankSchema } from "../validations/admin_banks.validation.js";

export const createBank = async (req, res, next) => {
  try {
    const { bank_name, bank_code } = req.body;
    const { error } = createBankSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    const result = await createBankService(bank_name, bank_code);

    res.status(201).json({
      status: 200,
      message: AdminResponseConstants.BankCreatedSuccessfully,
      data: {
        bank: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBanks = async (req, res, next) => {
  try {
    const result = await getAllBanksService();
    res.status(200).json({
      status: 200,
      message: AdminResponseConstants.BanksRetrievedSuccessfully,
      data: {
        banks: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBankById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Bank ID is required");
    }
    const result = await deleteBankByIdService(id);
    if (!result) {
      throw new BadRequestError("Bank not found or already deleted");
    }
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.BankDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};
