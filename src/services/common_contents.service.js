import {
  getAllBanksModel,
  getDonationDetailsListModel,
  getHowWePrayListModel,
  getOfferingsListModel,
  getPoojaListModel,
  getReligionDetailsByIdModel,
  getReligionListModel,
  getSouvernirsListModel,
  getTempleListModel,
} from "../models/common_contents.model.js";

export const getReligionListService = async () => {
  return await getReligionListModel();
};

export const getTempleListService = async (religionId) => {
  return await getTempleListModel(religionId);
};

export const getHowWePrayListService = async (religionId) => {
  return await getHowWePrayListModel(religionId);
};

export const getSouvernirsListService = async (religionId) => {
  return await getSouvernirsListModel(religionId);
};

export const getPoojaListService = async (religionId, isFeatured) => {
  return await getPoojaListModel(religionId, isFeatured);
};

export const getOfferingsListService = async (religionId) => {
  return await getOfferingsListModel(religionId);
};

export const getDonationDetailsListService = async (religionId) => {
  return await getDonationDetailsListModel(religionId);
};

export const getReligionDetailsByIdService = async (id) => {
  return await getReligionDetailsByIdModel(id);
};

export const getAllBanksService = async () => {
  return await getAllBanksModel();
};
