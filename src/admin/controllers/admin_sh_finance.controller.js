import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import {
  getFinanceDashboardDataService,
  getPriestPaymentStatusDetailsListService,
  getPriestPaymentSummeryDetailsService,
  getUsersSalesDataService,
  updatePriestEarningPaymentStatusService,
} from "../services/admin_sh_finance.service.js";
import { priestPaymentStatusChangeValidation } from "../validations/admin_sh_finance.validation.js";

export const getFinanceDashboardData = async (req, res, next) => {
  try {
    const { religion_id, period } = req.query;
    const result = await getFinanceDashboardDataService(religion_id, period);
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.FinanceDashboardDataFetchedSuccessfully,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersSalesData = async (req, res, next) => {
  try {
    const { religion_id, period } = req.query;
    let { page_number = 10, page_size = 10 } = req.query;
    if (typeof page_number === "string") {
      page_number = parseInt(page_number, 10);
    }
    if (typeof page_size === "string") {
      page_size = parseInt(page_size, 10);
    }
    if (page_number <= 0 || page_size <= 0) {
      throw new BadRequestError("Page number/page size must be greater than 0");
    }
    const result = await getUsersSalesDataService(
      religion_id,
      period,
      page_number,
      page_size
    );

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.FinanceDashboardDataFetchedSuccessfully,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriestPaymentSummeryDetails = async (req, res, next) => {
  try {
    const { religion_id, period } = req.query;
    const result = await getPriestPaymentSummeryDetailsService(
      religion_id,
      period
    );
    return res.status(200).json({
      status: 200,
      message:
        AdminResponseConstants.PriestPaymentSummeryDetailsFetchedSuccessfully,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriestPaymentStatusDetailsList = async (req, res, next) => {
  try {
    const { religion_id, period } = req.query;

    let { page_number = 10, page_size = 10 } = req.query;
    if (typeof page_number === "string") {
      page_number = parseInt(page_number, 10);
    }
    if (typeof page_size === "string") {
      page_size = parseInt(page_size, 10);
    }
    if (page_number <= 0 || page_size <= 0) {
      throw new BadRequestError("Page number/page size must be greater than 0");
    }

    const result = await getPriestPaymentStatusDetailsListService(
      religion_id,
      period,
      page_number,
      page_size
    );
    return res.status(200).json({
      status: 200,
      message:
        AdminResponseConstants.PriestPaymentStatusDetailsFetchedSuccessfully,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePriestEarningPaymentStatus = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const statusData = req.body;

    const { error } = priestPaymentStatusChangeValidation.validate(statusData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    const result = await updatePriestEarningPaymentStatusService(
      order_id,
      statusData
    );

    if (!result) {
      throw new BadRequestError("Failed to update the payment status");
    }

    return res.status(200).json({
      status: 200,
      message:
        AdminResponseConstants.PriestEarningPaymentStatusUpdatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};
