import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
import { getAllBookingsDetailsService } from "../services/admin_booking_pooja.service.js";

export const getAllBookingsDetails = async (req, res, next) => {
  try {
    const bookings = await getAllBookingsDetailsService();
    res.status(200).json({
      status: 200,
      message: AdminResponseConstants.BookingsDetailsFetchedSuccessfully,
      data: {
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};
