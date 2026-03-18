import { getPoojaDetailsByIdService } from "../admin/services/admin_pooja.service.js";
import { getSouvernirByIdService } from "../admin/services/admin_souvernir.service.js";
import { getTempleByIdService } from "../admin/services/admin_temple.service.js";
import razorpay from "../config/payment_gateway.config.js";
import responseConstants from "../constants/response_const.js";
import {
  cancelPoojaBookingService,
  createNewPoojaBookingService,
  getAllBookingsService,
  getCancelledPoojaBookingsService,
  getPoojaBookingDetailsByOrderIdService,
  getPreviousPoojaBookingsService,
  getUpcomingPoojaBookingsService,
  insertPoojaBookingSouvernirService,
  updatePoojaBookingPaymentDetailsByOrderIdService,
} from "../services/pooja_booking.service.js";
import { calculateBookingPrices } from "../utils/booking_calculations.utils.js";
import { BadRequestError } from "../utils/errors.utils.js";
import {
  bookingCalculationValidation,
  createNewPoojaBookingValidation,
  verifyPaymentValidation,
} from "../validations/pooja_booking.validation.js";
import { sendPriestNewRequestEmail, sendRefundRequestAdminEmail } from "../utils/email.utils.js";
import { getExistingPriestDetailsService } from "../services/priest.service.js";
import pool from '../config/db.config.js';

export const createNewPoojaBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const poojaBookingData = { user_id: userId, ...req.body };

    const { error } =
      createNewPoojaBookingValidation.validate(poojaBookingData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const poojaId = poojaBookingData.pooja_id;
    const modeOfPooja = poojaBookingData.mode_of_pooja;
    const templeId = poojaBookingData.temple_id;
    const numberOfDevotees = poojaBookingData.number_of_devotees;
    const additionalSouvernirDetails =
      poojaBookingData.additional_souvernir_details;

    const poojaDetails = await getPoojaDetailsByIdService(poojaId);
    const { location } = await getTempleByIdService(templeId);

    if (!poojaDetails) {
      throw new BadRequestError(responseConstants.PoojaNotFound);
    }

    const { price, currency } = poojaDetails;

    let toralSuvernirCost = 0;

    if (additionalSouvernirDetails && additionalSouvernirDetails.length > 0) {
      for (const souv of additionalSouvernirDetails) {
        const { id, quantity } = souv;

        if (!id || !quantity) {
          throw new BadRequestError(responseConstants.SouvernirDetailsRequired);
        }

        const souvDetails = await getSouvernirByIdService(id);

        if (!souvDetails) {
          throw new BadRequestError(responseConstants.SouvernirNotFound);
        }

        const { price } = souvDetails;
        toralSuvernirCost += parseFloat(price) * parseInt(quantity);
      }
    }

    const bookingCalculationDetails = calculateBookingPrices({
      basePrice: parseFloat(price),
      modeOfPooja: modeOfPooja,
      numberOfDevotees: numberOfDevotees,
      totalSouvernirCost: toralSuvernirCost,
    });

    const amount = parseFloat(bookingCalculationDetails.total_price) * 100; // Convert to paise

    const razorpayOptions = {
      amount: amount.toFixed(0), // Amount in paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(razorpayOptions);

    const poojaOrderSummeryDetails = {
      ...poojaBookingData,
      ...bookingCalculationDetails,
      pooja_location: location,
    };

    const pendingPaymentPooja = await createNewPoojaBookingService({
      ...poojaOrderSummeryDetails,
      order_id: order.id,
      payment_receipt_id: order.receipt,
    });

    if (additionalSouvernirDetails && additionalSouvernirDetails.length > 0) {
      for (const souv of additionalSouvernirDetails) {
        const { id, quantity } = souv;

        const souvDetails = await getSouvernirByIdService(id);

        if (!souvDetails) {
          throw new BadRequestError(responseConstants.SouvernirNotFound);
        }

        const { price } = souvDetails;
        await insertPoojaBookingSouvernirService({
          booking_id: pendingPaymentPooja.id,
          souv_id: id,
          quantity,
          price,
        });
      }
    }

    return res.status(201).json({
      status: 201,
      message: responseConstants.poojaBookingDetailsCreated,
      data: {
        order_details: order,
        // order_summery_details: poojaOrderSummeryDetails,
      },
    });
  } catch (error) {
    console.error("Error creating pooja booking:", error);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userEmail = req.user.email;

    const { error } = verifyPaymentValidation.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    //! Verify Payment
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    //! Check if payment was failed
    if (payment.status === "failed") {
      await updatePoojaBookingPaymentDetailsByOrderIdService({
        orderId: razorpay_order_id,
        status: "failed",
        paymentId: razorpay_payment_id,
      });
      throw new BadRequestError(responseConstants.PaymentVerificationFailed);
    }
    //! Check if payment was successful
    else if (payment.status === "captured") {
      await updatePoojaBookingPaymentDetailsByOrderIdService({
        orderId: razorpay_order_id,
        status: "completed",
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });
      const poojaBookingDetails = await getPoojaBookingDetailsByOrderIdService(
        razorpay_order_id
      );

      // Trigger Email Notification to Priest
      if (poojaBookingDetails && poojaBookingDetails.priest_id) {
        const priestDetails = await getExistingPriestDetailsService(poojaBookingDetails.priest_id);
        if (priestDetails && priestDetails.email) {
          await sendPriestNewRequestEmail(
            priestDetails.email,
            poojaBookingDetails.id,
            poojaBookingDetails.pooja_name,
            poojaBookingDetails.user_name || "a Devotee",
            poojaBookingDetails.pooja_date,
            poojaBookingDetails.pooja_time
          );
        }
      }

      // await sendOrderConformationEmail({
      //   user_email: userEmail,
      //   ...poojaBookingDetails,
      // });
      return res.status(200).json({
        status: 200,
        message: responseConstants.PaymentVerifiedSuccessfully,
        data: poojaBookingDetails,
      });
    }

    //! Check if payment is pending
    else if (payment.status === "pending" || payment.status === "created") {
      await updatePoojaBookingPaymentDetailsByOrderIdService({
        orderId: razorpay_order_id,
        status: "pending",
        paymentId: razorpay_payment_id,
      });
      throw new BadRequestError(responseConstants.PaymentPending);
    }

    //! Check if payment is authorized
    else if (payment.status === "authorized") {
      await updatePoojaBookingPaymentDetailsByOrderIdService({
        orderId: razorpay_order_id,
        status: "authorized",
        paymentId: razorpay_payment_id,
      });
      throw new BadRequestError(responseConstants.PaymentAuthorized);
    }

    //! Check if payment is refunded
    else if (payment.status === "refunded") {
      await updatePoojaBookingPaymentDetailsByOrderIdService({
        orderId: razorpay_order_id,
        status: "refunded",
        paymentId: razorpay_payment_id,
      });
      throw new BadRequestError(responseConstants.PaymentRefunded);
    } else {
      throw new BadRequestError(responseConstants.PaymentUnknown);
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    next(error);
  }
};

export const getBookingCalculationDetails = async (req, res, next) => {
  try {
    const {
      pooja_id,
      temple_id,
      additional_souvernir_details,
    } = req.body;

    const { error } = bookingCalculationValidation.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const poojaDetails = await getPoojaDetailsByIdService(pooja_id);

    if (!poojaDetails) {
      throw new BadRequestError(responseConstants.PoojaNotFound);
    }

    const basePrice = parseFloat(poojaDetails.price);

    let total_suvernir_cost = 0;

    if (
      additional_souvernir_details &&
      additional_souvernir_details.length > 0
    ) {
      for (const souv of additional_souvernir_details) {
        const { id, quantity } = souv;

        if (!id || !quantity) {
          throw new BadRequestError(responseConstants.SouvernirDetailsRequired);
        }

        const souvDetails = await getSouvernirByIdService(id);

        if (!souvDetails) {
          throw new BadRequestError(responseConstants.SouvernirNotFound);
        }

        const { price } = souvDetails;
        total_suvernir_cost += parseFloat(price) * parseInt(quantity);
      }
    }

    // Fetch Temple Multiplier
    const [templeRows] = await pool.execute(`
      SELECT t.*, tt.multiplier AS temple_multiplier
      FROM temples t
      LEFT JOIN temple_types tt ON t.temple_type_id = tt.id
      WHERE t.id = ?
    `, [temple_id]);

    if (templeRows.length === 0) {
      throw new BadRequestError("Temple not found");
    }

    const templeMultiplier = parseFloat(templeRows[0].temple_multiplier || 1.0);

    // Fetch Modes and Groups
    const [modes] = await pool.execute("SELECT * FROM ritual_modes");
    const [groups] = await pool.execute("SELECT * FROM ritual_groups");

    // Construct Response
    const packagesByCategory = groups.map(group => {
      const groupMultiplier = parseFloat(group.multiplier);
      
      const subPackages = modes.map(mode => {
        const modeMultiplier = parseFloat(mode.multiplier);
        
        // Final Price = Base Ritual Value × Temple Multiplier × Mode Multiplier × Group Multiplier
        let finalPrice = basePrice * templeMultiplier * modeMultiplier * groupMultiplier;
        
        // Add souvenier cost if any
        finalPrice = Math.round(finalPrice) + total_suvernir_cost;

        return {
          mode_name: mode.name,
          package_name: `${group.display_name} ${mode.name.split(" ")[0]}`,
          price: finalPrice,
          multipliers: {
            base_price: basePrice,
            temple_multiplier: templeMultiplier,
            mode_multiplier: modeMultiplier,
            group_multiplier: groupMultiplier
          }
        };
      });

      return {
        category_name: group.display_name,
        group_name: group.name,
        packages: subPackages
      };
    });

    return res.status(200).json({
      status: 200,
      message: responseConstants.BookingCalculationDetailsFetched,
      data: packagesByCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getCancelledPoojaBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Call the service to get cancelled pooja bookings
    const cancelledBookings = await getCancelledPoojaBookingsService(userId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.CancelledPoojaBookingsFetched,
      data: cancelledBookings,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelPoojaBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    if (!bookingId) {
      throw new BadRequestError(responseConstants.BookingIdRequired);
    }

    const cancelledBooking = await cancelPoojaBookingService(bookingId, userId);

    if (!cancelledBooking) {
      throw new BadRequestError(responseConstants.BookingNotFound);
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.PoojaBookingCancelledSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingPoojaBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Call the service to get upcoming pooja bookings
    const upcomingBookings = await getUpcomingPoojaBookingsService(userId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.UpcomingPoojaBookingsFetched,
      data: upcomingBookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getPreviousPoojaBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Call the service to get previous pooja bookings
    const previousBookings = await getPreviousPoojaBookingsService(userId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.PreviousPoojaBookingsFetched,
      data: previousBookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { pooja_date, pooja_id } = req.query;

    const bookings = await getAllBookingsService(userId, pooja_date, pooja_id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.BookingsFetched,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const requestRefundPoojaBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { order_id } = req.body;

    if (!order_id) {
      throw new BadRequestError("Order ID is required.");
    }

    const bookingDetails = await getPoojaBookingDetailsByOrderIdService(order_id);

    if (!bookingDetails) {
      throw new BadRequestError("Booking not found.");
    }

    if (bookingDetails.user_id !== userId) {
      throw new BadRequestError("Unauthorized refund request.");
    }

    if (bookingDetails.status !== 'cancelled') {
      throw new BadRequestError("Only cancelled bookings are eligible for refunds.");
    }

    const [userEmailRes] = await pool.execute('SELECT email, user_name FROM users WHERE id = ?', [userId]);
    const userEmail = userEmailRes[0]?.email;
    const userName = userEmailRes[0]?.user_name || "A Devotee";

    await sendRefundRequestAdminEmail(
      order_id,
      bookingDetails.pooja_name,
      userName,
      userEmail
    );

    return res.status(200).json({
      status: 200,
      message: "Refund request submitted. The admin team has been notified.",
    });
  } catch (error) {
    console.error("Error requesting refund:", error);
    next(error);
  }
};

export const reassignPriestPoojaBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { order_id, new_priest_id } = req.body;

    if (!order_id || !new_priest_id) {
      throw new BadRequestError("Order ID and New Priest ID are required.");
    }

    const bookingDetails = await getPoojaBookingDetailsByOrderIdService(order_id);

    if (!bookingDetails) {
      throw new BadRequestError("Booking not found.");
    }

    if (bookingDetails.user_id !== userId) {
      throw new BadRequestError("Unauthorized reassignment request.");
    }

    if (bookingDetails.status !== 'cancelled') {
      throw new BadRequestError("Only cancelled bookings can be reassigned to a new priest.");
    }

    const reassignQuery = `
      UPDATE pooja_bookings 
      SET priest_id = ?, status = 'pending', priest_order_status = 'pending', user_order_status = 'active', cancel_reason = NULL 
      WHERE order_id = ? AND user_id = ?
    `;

    const [result] = await pool.execute(reassignQuery, [new_priest_id, order_id, userId]);

    if (result.affectedRows === 0) {
      throw new BadRequestError("Failed to reassign priest.");
    }

    // Trigger Email Notification to New Priest
    const priestDetailsAndEmailRes = await pool.execute('SELECT email FROM users WHERE id = ?', [new_priest_id]);
    const priestEmail = priestDetailsAndEmailRes[0]?.[0]?.email;

    if (priestEmail) {
      const [userEmailRes] = await pool.execute('SELECT user_name FROM users WHERE id = ?', [userId]);
      const userName = userEmailRes[0]?.[0]?.user_name || "A Devotee";

      await sendPriestNewRequestEmail(
        priestEmail,
        bookingDetails.id, // passing primary DB id as it is expected by the mailer logic typically for new assignments, although order_id might work too. Wait, poojaBookingsDetails contains the POOJA name.
        bookingDetails.pooja_name,
        userName,
        bookingDetails.pooja_date,
        bookingDetails.pooja_time
      );
    }

    return res.status(200).json({
      status: 200,
      message: "Priest reassigned successfully. Pending Priest acceptance.",
    });
  } catch (error) {
    console.error("Error reassigning priest:", error);
    next(error);
  }
};
