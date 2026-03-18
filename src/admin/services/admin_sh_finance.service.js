import {
  getFinanceDashboardDataModel,
  getPriestPaymentStatusDetailsListModel,
  getPriestPaymentSummeryDetailsModel,
  getUsersSalesDataModel,
  updatePriestEarningPaymentStatusModel,
} from "../models/admin_sh_finance.model.js";

export const getFinanceDashboardDataService = async (religionId, period) => {
  return getFinanceDashboardDataModel(religionId, period);
};

export const getUsersSalesDataService = async (
  religionId,
  period,
  page_number,
  page_size
) => {
  return getUsersSalesDataModel(religionId, period, page_number, page_size);
};

export const getPriestPaymentSummeryDetailsService = async (
  religionId,
  period
) => {
  return await getPriestPaymentSummeryDetailsModel(religionId, period);
};

export const getPriestPaymentStatusDetailsListService = async (
  religionId,
  period,
  page_number,
  page_size
) => {
  return await getPriestPaymentStatusDetailsListModel(
    religionId,
    period,
    page_number,
    page_size
  );
};

export const updatePriestEarningPaymentStatusService = async (
  orderId,
  statusData
) => {
  return await updatePriestEarningPaymentStatusModel(orderId, statusData);
};
