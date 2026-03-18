import AdminResponseConstant from "../constants/admin_response_const.js";
import {
  getAllPriestsService,
  getPriestAcceptedPoojaBookingsByPriestIdService,
  getPriestCompletedPoojaBookingsService,
  getPriestRatingDetailsByIdService,
  getPriestsEarningDetailsService,
} from "../services/admin_priest.service.js";

export const getAllPriests = async (req, res, next) => {
  try {
    const { religion_id } = req.query;
    const priests = await getAllPriestsService(religion_id);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstant.PriestsRetrievedSuccessfully,
      data: priests,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriestRatingDetailsById = async (req, res, next) => {
  try {
    const { priestId } = req.params;

    if (!priestId) {
      throw new Error("Priest ID is required");
    }

    // Assuming getPriestRatingDetailsByIdService is defined in the service layer
    const ratingDetails = await getPriestRatingDetailsByIdService(priestId);

    return res.status(200).json({
      status: 200,
      message: "Priest rating details retrieved successfully",
      data: ratingDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriestAcceptedPoojaBookingsByPriestId = async (
  req,
  res,
  next
) => {
  try {
    const { priestId } = req.params;

    if (!priestId) {
      throw new Error("Priest ID is required");
    }

    const bookings = await getPriestAcceptedPoojaBookingsByPriestIdService(
      priestId
    );

    return res.status(200).json({
      status: 200,
      message: "Priest accepted pooja bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriestsEarningDetails = async (req, res, next) => {
  try {
    const { religion_id, period } = req.query;

    const earningDetails = await getPriestsEarningDetailsService(
      religion_id,
      period
    );
    return res.status(200).json({
      status: 200,
      message: "Priest earning details retrieved successfully",
      data: earningDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriestCompletedPoojaBookings = async (req, res, next) => {
  try {
    const { priestId } = req.params;

    if (!priestId) {
      throw new Error("Priest ID is required");
    }

    const bookings = await getPriestCompletedPoojaBookingsService(priestId);

    return res.status(200).json({
      status: 200,
      message: "Completed pooja bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
