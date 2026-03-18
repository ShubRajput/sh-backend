import {
  addPoojaToFavoritesModel,
  addTempleToFavoritesModel,
  checkPjoojaExistsInFavoritesModel,
  checkPoojaIdExistsModel,
  checkTempleExistsInFavoritesModel,
  checkTempleIdExistsModel,
  getUserFavouritePoojasModel,
  getUserFavouriteTemplesModel,
  removePoojaFromFavoritesModel,
  removeTempleFromFavoritesModel,
} from '../models/user_favourite_pooja_and_temples.model.js';

export const addPoojaToFavoritesService = async (userId, poojaId) => {
  return await addPoojaToFavoritesModel(userId, poojaId);
};

export const checkPjoojaExistsInFavoritesService = async (userId, poojaId) => {
  return await checkPjoojaExistsInFavoritesModel(userId, poojaId);
};

export const getUserFavouritePoojasService = async (userId) => {
  return await getUserFavouritePoojasModel(userId);
};

export const addTempleToFavoritesService = async (userId, templeId) => {
  return await addTempleToFavoritesModel(userId, templeId);
};

export const checkTempleExistsInFavoritesService = async (userId, templeId) => {
  return await checkTempleExistsInFavoritesModel(userId, templeId);
};

export const checkTempleIdExistsService = async (templeId) => {
  return await checkTempleIdExistsModel(templeId);
};

export const checkPoojaIdExistsService = async (poojaId) => {
  return await checkPoojaIdExistsModel(poojaId);
};

export const getUserFavouriteTemplesService = async (userId) => {
  return await getUserFavouriteTemplesModel(userId);
};

export const removePoojaFromFavoritesService = async (userId, poojaId) => {
  return await removePoojaFromFavoritesModel(userId, poojaId);
};
export const removeTempleFromFavoritesService = async (userId, templeId) => {
  return await removeTempleFromFavoritesModel(userId, templeId);
};
