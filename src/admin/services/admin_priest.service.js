import { decrypt } from "../../utils/payment.utils.js";
import {
  getAllPriestsModel,
  getPriestAcceptedPoojaBookingsByPriestIdModel,
  getPriestCompletedPoojaBookingsModel,
  getPriestRatingDetailsByIdModel,
  getPriestsEarningDetailsModel,
} from "../models/admin_priest.model.js";

export const getAllPriestsService = async (religionId) => {
  const priestList = await getAllPriestsModel(religionId);
  // Decrypt sensitive payment details
  priestList.forEach((priest) => {
    if (priest.payment_details) {
      const { account_holder_name, bank_name, branch_name, account_number } =
        priest.payment_details;
      if (account_holder_name) {
        priest.payment_details.account_holder_name =
          decrypt(account_holder_name);
      }
      if (bank_name) {
        priest.payment_details.bank_name = decrypt(bank_name);
      }
      if (branch_name) {
        priest.payment_details.branch_name = decrypt(branch_name);
      }
      if (account_number) {
        priest.payment_details.account_number = decrypt(account_number);
      }
    }
  });

  return priestList;
};

export const getPriestRatingDetailsByIdService = async (priestId) => {
  return await getPriestRatingDetailsByIdModel(priestId);
};

export const getPriestAcceptedPoojaBookingsByPriestIdService = async (
  priestId
) => {
  return await getPriestAcceptedPoojaBookingsByPriestIdModel(priestId);
};

export const getPriestsEarningDetailsService = async (religionId, period) => {
  return await getPriestsEarningDetailsModel(religionId, period);
};

export const getPriestCompletedPoojaBookingsService = async (priestId) => {
  return await getPriestCompletedPoojaBookingsModel(priestId);
};
