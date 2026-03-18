import responseConstants from "../constants/response_const.js";
import {
  creatUserDevoteeService,
  deleteUserDevoteeByIdService,
  getUserAllDevoteesByUserIdService,
  updateUserDevoteeByIdService,
} from "../services/user_devotee.service.js";
import { BadRequestError } from "../utils/errors.utils.js";
import {
  creatUserDevoteeValidation,
  updateUserDevoteeByIdValidation,
} from "../validations/user_devotee.validation.js";

export const createUserDevotee = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const devoteeData = { ...req.body };

    const { error } = creatUserDevoteeValidation.validate(devoteeData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const newDevotee = await creatUserDevoteeService(userId, devoteeData);

    return res.status(201).json({
      status: 201,
      message: responseConstants.DevoteeCreatedSuccessfully,
      data: newDevotee,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAllDevoteesByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const devotees = await getUserAllDevoteesByUserIdService(userId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DevoteeRetrievedSuccessfully,
      data: devotees,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserDevoteeById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const devoteeId = req.params.id;

    if (!devoteeId) {
      throw new BadRequestError("Devotee ID is required");
    }

    const isSuccess = await deleteUserDevoteeByIdService(userId, devoteeId);

    if (!isSuccess) {
      throw new BadRequestError("Devotee not found or not owned by user");
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.DevoteeDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserDevoteeById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const devoteeId = req.params.id;
    const devoteeData = { ...req.body };

    if (!devoteeId) {
      throw new BadRequestError("Devotee ID is required");
    }

    const { error } = updateUserDevoteeByIdValidation.validate(devoteeData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const updatedDevotee = await updateUserDevoteeByIdService(
      userId,
      devoteeId,
      devoteeData
    );

    if (!updatedDevotee) {
      throw new BadRequestError("Devotee not found or not owned by user");
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.DevoteeUpdatedSuccessfully,
      data: updatedDevotee,
    });
  } catch (error) {
    next(error);
  }
};
