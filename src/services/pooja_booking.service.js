import {
  cancelPoojaBookingModel,
  createNewPoojaBookingModel,
  getAllBookingsModel,
  getCancelledPoojaBookingsModel,
  getPoojaBookingDetailsByOrderIdModel,
  getPreviousPoojaBookingsModel,
  getUpcomingPoojaBookingsModel,
  insertPoojaBookingSouvernirModel,
  updatePoojaBookingPaymentDetailsByOrderIdModel,
} from "../models/pooja_booking.model.js";

export const createNewPoojaBookingService = async (bookingData) => {
  return await createNewPoojaBookingModel(bookingData);
};

export const getCancelledPoojaBookingsService = async (userId) => {
  return await getCancelledPoojaBookingsModel(userId);
};

export const cancelPoojaBookingService = async (bookingId, userId) => {
  return await cancelPoojaBookingModel(bookingId, userId);
};

export const getUpcomingPoojaBookingsService = async (userId) => {
  return await getUpcomingPoojaBookingsModel(userId);
};

export const getPreviousPoojaBookingsService = async (userId) => {
  return await getPreviousPoojaBookingsModel(userId);
};

export const getAllBookingsService = async (userId, pooja_date, pooja_id) => {
  return await getAllBookingsModel(userId, pooja_date, pooja_id);
};

export const insertPoojaBookingSouvernirService = async (souvData) => {
  return await insertPoojaBookingSouvernirModel(souvData);
};

export const updatePoojaBookingPaymentDetailsByOrderIdService = async (
  details
) => {
  return await updatePoojaBookingPaymentDetailsByOrderIdModel(details);
};

export const getPoojaBookingDetailsByOrderIdService = async (orderId) => {
  return await getPoojaBookingDetailsByOrderIdModel(orderId);
};
