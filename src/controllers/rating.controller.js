import responseConstants from '../constants/response_const.js';
import {
  createNewRatingService,
  getAllRatingsService,
} from '../services/rating.service.js';
import { BadRequestError } from '../utils/errors.utils.js';
import { createRatingValidation } from '../validations/rating.validation.js';

export const getAllRatings = async (req, res, next) => {
  try {
    const priestId = req.user.id;

    const ratings = await getAllRatingsService(priestId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.RatingsRetrievedSuccessfully,
      data: ratings,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewRating = async (req, res, next) => {
  try {
    const ratingData = req.body;

    const { error } = createRatingValidation.validate(ratingData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const newPooja = await createNewRatingService({
      ...ratingData,
      user_id: req.user.id,
    });

    return res.status(201).json({
      status: 201,
      message: responseConstants.RatingCreatedSuccessfully,
      data: newPooja,
    });
  } catch (error) {
    next(error);
  }
};
