import {
  createNewAdminOfferingModel,
  deleteAdminOfferingByIdModel,
  deleteAdminOfferingImagebyIdModel as deleteAdminOfferingImageByIdModel,
  getAdminOfferingDetailsByIdModel,
  getAdminOfferingImageDetailsByOfferingIdAndImageTypeModel,
  getAllAdminOfferingsModel,
  getExistingAdminOfferingImageDetailsByIdModel,
  getOfferingsFinancialDetailsModel,
  updateAdminOfferingByIdModel,
  uploadAdminOfferingImageModel,
} from "../models/admin_offerings.model.js";

export const createNewAdminOfferingService = async (offeringData) => {
  return createNewAdminOfferingModel(offeringData);
};

export const getAllAdminOfferingsService = async (religionId) => {
  return getAllAdminOfferingsModel(religionId);
};

export const deleteAdminOfferingByIdService = async (offeringId) => {
  return deleteAdminOfferingByIdModel(offeringId);
};

export const getAdminOfferingDetailsByIdService = async (offeringId) => {
  return getAdminOfferingDetailsByIdModel(offeringId);
};

export const updateAdminOfferingByIdService = async (
  offeringId,
  offeringData
) => {
  return updateAdminOfferingByIdModel(offeringId, offeringData);
};

export const deleteAdminOfferingImageByIdService = async (imageId) => {
  return deleteAdminOfferingImageByIdModel(imageId);
};

export const getExistingAdminOfferingImageDetailsByIdService = async (
  imageId
) => {
  return getExistingAdminOfferingImageDetailsByIdModel(imageId);
};

export const uploadAdminOfferingImageService = async (imageData) => {
  return uploadAdminOfferingImageModel(imageData);
};

export const getAdminOfferingImageDetailsByOfferingIdAndImageTypeService =
  async (offeringId, imageType) => {
    return getAdminOfferingImageDetailsByOfferingIdAndImageTypeModel(
      offeringId,
      imageType
    );
  };

export const getOfferingsFinancialDetailsService = async (
  religionId,
  period
) => {
  return await getOfferingsFinancialDetailsModel(religionId, period);
};
