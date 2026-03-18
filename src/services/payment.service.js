import { addPaymentDetailsModel, updatePaymentDetailsModel, getAllPriestAccountsModel } from "../models/payment.model.js";

export const addPaymentDetailsService = async (userId, paymentDetails) => {
  return await addPaymentDetailsModel(userId, paymentDetails);
};

export const updatePaymentDetailsService = async (paymentDetailsId, paymentDetailsData) => {
  return await updatePaymentDetailsModel(paymentDetailsId, paymentDetailsData);
};

export const getAllPaymentDetailsService = async (userId) => {
  return await getAllPriestAccountsModel(userId);
};
