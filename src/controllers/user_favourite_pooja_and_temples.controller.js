import responseConstants from '../constants/response_const.js';
import {
  addPoojaToFavoritesService,
  addTempleToFavoritesService,
  checkPjoojaExistsInFavoritesService,
  checkPoojaIdExistsService,
  checkTempleExistsInFavoritesService,
  checkTempleIdExistsService,
  getUserFavouritePoojasService,
  getUserFavouriteTemplesService,
  removePoojaFromFavoritesService,
  removeTempleFromFavoritesService,
} from '../services/user_favourite_pooja_and_temples.service.js';
import { BadRequestError } from '../utils/errors.utils.js';
import {
  addUserFavouritePoojaValidation,
  addUserFavouriteTempleValidation,
  removeUserFavouritePoojaValidation,
  removeUserFavouriteTempleValidation,
} from '../validations/user_favourite_pooja_and_temples.validation.js';

export const addPoojaToFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const body = { ...req.body };

    const { error } = addUserFavouritePoojaValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const poojaId = body.pooja_id;

    const isPoojaIdExists = await checkPoojaIdExistsService(poojaId);
    if (!isPoojaIdExists) {
      throw new BadRequestError(responseConstants.PoojaNotFound);
    }

    const poojaExists = await checkPjoojaExistsInFavoritesService(
      userId,
      poojaId
    );

    if (poojaExists) {
      throw new BadRequestError(responseConstants.PoojaAlreadyInFavorites);
    }

    await addPoojaToFavoritesService(userId, poojaId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.PoojaAddedToFavorites,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFavouritePoojaAndTemples = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favouritePoojas = await getUserFavouritePoojasService(userId);
    const favouriteTemples = await getUserFavouriteTemplesService(userId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserFavouritePoojaAndTemplesRetrieved,
      data: {
        favourite_pooja: favouritePoojas,
        favourite_temples: favouriteTemples,
      }, // Assuming favourite temples will be added later
    });
  } catch (error) {
    next(error);
  }
};

export const addTempleToFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const body = { ...req.body };

    const { error } = addUserFavouriteTempleValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const templeId = body.temple_id;

    const isTempleExists = await checkTempleIdExistsService(templeId);

    if (!isTempleExists) {
      throw new BadRequestError(responseConstants.TempleNotFound);
    }

    const isTempleExistInFavouriteList =
      await checkTempleExistsInFavoritesService(userId, templeId);

    if (isTempleExistInFavouriteList) {
      throw new BadRequestError(responseConstants.TempleAlreadyInFavorites);
    }

    await addTempleToFavoritesService(userId, templeId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.TempleAddedToFavorites,
    });
  } catch (error) {
    next(error);
  }
};

export const removePoojaFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const params = { pooja_id: req.params.pooja_id };

    const { error } = removeUserFavouritePoojaValidation.validate(params);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const poojaId = params.pooja_id;

    const isPoojaExists = await checkPoojaIdExistsService(poojaId);

    if (!isPoojaExists) {
      throw new BadRequestError(responseConstants.PoojaNotFound);
    }

    const isPoojaInFavorites = await checkPjoojaExistsInFavoritesService(
      userId,
      poojaId
    );

    if (!isPoojaInFavorites) {
      throw new BadRequestError(responseConstants.PoojaNotFound);
    }

    await removePoojaFromFavoritesService(userId, poojaId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.PoojaRemovedFromFavorites,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTempleFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const params = { temple_id: req.params.temple_id };

    const { error } = removeUserFavouriteTempleValidation.validate(params);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const templeId = params.temple_id;

    const isTempleExists = await checkTempleIdExistsService(templeId);

    if (!isTempleExists) {
      throw new BadRequestError(responseConstants.TempleNotFound);
    }

    const isTempleInFavorites = await checkTempleExistsInFavoritesService(
      userId,
      templeId
    );

    if (!isTempleInFavorites) {
      throw new BadRequestError(responseConstants.TempleNotFound);
    }

    await removeTempleFromFavoritesService(userId, templeId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.TempleRemovedFromFavorites,
    });
  } catch (error) {
    next(error);
  }
};
