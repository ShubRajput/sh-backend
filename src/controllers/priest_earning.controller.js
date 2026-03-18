import responseConstants from '../constants/response_const.js';
import { getExistingUserDetailsService } from '../services/auth.service.js';
import {
  getPriestEarningsService,
} from '../services/priest_earning.service.js';
import { NotFoundError } from '../utils/errors.utils.js';

export const getTodayEarnings = async (req, res, next) => {
  try {
    const priestId = req.user.id;

    const user = await getExistingUserDetailsService(priestId);

    if (!user) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }
    const data = await getPriestEarningsService(priestId, "today");

    res.status(200).json({
      status: 200,
      message: "Today earnings fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthEarnings = async (req, res, next) => {
  try {
    const priestId = req.user.id;

    const user = await getExistingUserDetailsService(priestId);

    if (!user) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }
    const data = await getPriestEarningsService(priestId, "month");

    res.status(200).json({
      status: 200,
      message: "Monthly earnings fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getYearEarnings = async (req, res, next) => {
  try {
    const priestId = req.user.id;

    const user = await getExistingUserDetailsService(priestId);

    if (!user) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }
    const data = await getPriestEarningsService(priestId, "year");

    res.status(200).json({
      status: 200,
      message: "Yearly earnings fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEarnings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await getExistingUserDetailsService(userId);

    if (!user) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }
    const data = await getPriestEarningsService(userId, "all");

    res.status(200).json({
      status: 200,
      message: "All earnings fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
