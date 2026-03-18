import {
  createUserDonationModel,
  updateUserDonationStatusModel,
} from '../models/user_donations.model.js';
import { BadRequestError } from '../utils/errors.utils.js';

export const createUserDonationService = async (userId, donationData) => {
  try {
    const result = await createUserDonationModel(userId, donationData);
    return result;
  } catch (error) {
    throw new BadRequestError(error);
  }
};

export const updateUserDonationStatusService = async (
  orderId,
  paymentDetails
) => {
  try {
    const result = await updateUserDonationStatusModel(orderId, paymentDetails);
    return result;
  } catch (error) {
    throw new BadRequestError(error);
  }
};
