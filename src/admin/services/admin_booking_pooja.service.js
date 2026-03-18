import { getAllBookingsDetailsModel } from "../models/admin_booking_pooja.model.js";

export const getAllBookingsDetailsService = async () => {
  try {
    const bookings = await getAllBookingsDetailsModel();
    return bookings;
  } catch (error) {
    throw error;
  }
};
