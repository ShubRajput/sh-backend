import {
  createAdminDonationContentModel,
  deleteAdminDonationContentByIdModel,
  getAllAdminDonationContentsModel,
  getAllUsersDonationsModel,
  getExistingDonationContentByDonationIdModel,
  updateAdminDonationContentByIdModel,
} from "../models/admin_donations.model.js";

export const getAllUsersDonationsService = async (period, religionId) => {
  const donations = await getAllUsersDonationsModel(period, religionId);
  return donations;
};

export const createAdminDonationContentService = async (donationData) => {
  const donation = await createAdminDonationContentModel(donationData);
  return donation;
};

export const getAllAdminDonationContentsService = async (religionId) => {
  const donations = await getAllAdminDonationContentsModel(religionId);
  return donations;
};

export const deleteAdminDonationContentByIdService = async (id) => {
  const result = await deleteAdminDonationContentByIdModel(id);
  return result;
};

export const getExistingDonationContentByDonationIdService = async (id) => {
  const donation = await getExistingDonationContentByDonationIdModel(id);
  return donation;
};

export const updateAdminDonationContentByIdService = async (
  id,
  donationData
) => {
  const result = await updateAdminDonationContentByIdModel(id, donationData);
  return result;
};
