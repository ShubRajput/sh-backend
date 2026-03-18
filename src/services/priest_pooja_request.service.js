import { insertPriestEarningModel } from '../models/priest_earnings.model.js';
import {
  getPendingNewPoojaRequestsModel,
  getPoojaRequestByStatusModel,
  handlePriestPoojaRequestModel,
  ignorePoojaBookingRequestModel,
  updateAcceptedPoojaRequestModel,
  cancelPriestPoojaRequestModel,
} from '../models/priest_pooja_request.model.js';

export const handlePriestPoojaRequestService = async (data) => {
  return await handlePriestPoojaRequestModel(data);
};

export const getPoojaRequestByStatusService = async (priestId, status) => {
  return await getPoojaRequestByStatusModel(priestId, status);
};

export const updateAcceptedPoojaRequestService = async (requestedData) => {
  return await updateAcceptedPoojaRequestModel(requestedData);
};

export const getPendingNewPoojaRequestsService = async (priestId) => {
  return await getPendingNewPoojaRequestsModel(priestId);
};

export const insertPriestEarningService = async (bookingData) => {
  return await insertPriestEarningModel(bookingData);
};

export const ignorePoojaBookingRequestService = async (priestId, orderId, cancelReason) => {
  return await ignorePoojaBookingRequestModel(priestId, orderId, cancelReason);
};

export const cancelPriestPoojaRequestService = async (priestId, orderId, cancelReason) => {
  return await cancelPriestPoojaRequestModel(priestId, orderId, cancelReason);
};
