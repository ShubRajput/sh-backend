import { createNewRatingsModel, getAllRatingModel } from "../models/rating.model.js";

export const createNewRatingService = async (ratingData) => {
  return await createNewRatingsModel(ratingData);
};

export const getAllRatingsService = async (priestId) => {
  return await getAllRatingModel(priestId);
};
