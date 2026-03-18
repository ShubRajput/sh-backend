import {
  getAllOfferingsModel,
  getOfferingBasicDetailsModel,
  getOfferingsByIdModel,
  submitUserOfferingModel,
  updateUserOfferingModel,
} from '../models/offerings.model.js';

export const getAllOfferingsService = async (religionId) => {
  return await getAllOfferingsModel(religionId);
};

export const getOfferingsByIdService = async (OfferingsId) => {
  return await getOfferingsByIdModel(OfferingsId);
};

export const submitUserOfferingService = async (userId, offeringData) => {
  return await submitUserOfferingModel(userId, offeringData);
};

export const updateUserOfferingService = async (orderId, paymentDetails) => {
  return await updateUserOfferingModel(orderId, paymentDetails);
};

export const getOfferingBasicDetailsService = async (offeringId) => {
  return await getOfferingBasicDetailsModel(offeringId);
};
