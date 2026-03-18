import {
  getPendingNewPoojaRequestsService,
  getPoojaRequestByStatusService,
  handlePriestPoojaRequestService,
  ignorePoojaBookingRequestService,
  insertPriestEarningService,
  updateAcceptedPoojaRequestService,
  cancelPriestPoojaRequestService,
} from '../services/priest_pooja_request.service.js';
import { BadRequestError } from '../utils/errors.utils.js';
import {
  handlePriestPoojaRequestValidation,
  orderIdValidation,
  cancelPriestPoojaRequestValidation,
} from '../validations/priest_pooja_request.validation.js';
import {
  sendPriestAcceptedEmail,
  sendPriestCancelledEmail,
} from '../utils/email.utils.js';
import { getPoojaBookingDetailsByOrderIdService } from '../services/pooja_booking.service.js';
import pool from '../config/db.config.js';

// Change request pooja status to accepted (active) and upload url
export const handlePriestPoojaRequest = async (req, res, next) => {
  try {
    const priestId = req.user.id;
    if (!priestId) {
      throw new BadRequestError(
        "Only a registered priest is allowed to perform this action."
      );
    }

    const poojaRequestData = { priest_id: priestId, ...req.body };

    const { error } =
      handlePriestPoojaRequestValidation.validate(poojaRequestData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const data = await handlePriestPoojaRequestService(poojaRequestData);

    // If the request was to accept the pooja, trigger the assigned email
    if (req.body.status === "active" || req.body.status === "accepted") {
      const bookingDetails = await getPoojaBookingDetailsByOrderIdService(req.body.order_id);
      if (bookingDetails && bookingDetails.user_id) {
        const userEmailRes = await pool.execute('SELECT email FROM users WHERE id = ?', [bookingDetails.user_id]);
        const userEmail = userEmailRes[0]?.[0]?.email;
        if (userEmail) {
          await sendPriestAcceptedEmail(
            userEmail,
            req.body.order_id,
            bookingDetails.pooja_name,
            bookingDetails.priest_details?.user_name || 'Your Priest',
            bookingDetails.pooja_date,
            bookingDetails.pooja_time
          );
        }
      }
    }

    res.status(200).json({
      status: 200,
      message: "Pooja request updated successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getPoojaRequestByStatus = async (req, res, next) => {
  try {
    const priestId = req.user.id;
    const status = req.query.status;
    if (!priestId) {
      throw new BadRequestError(
        "Only a registered priest is allowed to perform this action."
      );
    }

    const pooja = await getPoojaRequestByStatusService(priestId, status);

    return res.status(200).json({
      status: 200,
      message: "Pooja details fetched.",
      data: pooja,
    });
  } catch (error) {
    next(error);
  }
};

// Handle pooja completed/cancelled status and earnings process
export const updateAcceptedPoojaRequest = (action) => {
  return async (req, res, next) => {
    try {
      const priestId = req.user.id;
      if (!priestId) throw new BadRequestError("Priest is not found.");

      const { order_id } = req.body;

      const { error } = orderIdValidation.validate(req.body);
      if (error) throw new BadRequestError(error.details[0].message);

      const updatedData = await updateAcceptedPoojaRequestService({
        action: action,
        orderId: order_id,
        priestId: priestId,
      });

      if (action === "completed") {
        await insertPriestEarningService({
          orderId: order_id,
          bookingId: updatedData.id,
          priestId: priestId,
        });
      }

      return res.status(200).json({
        status: 200,
        message: `Pooja request ${action} successfully.`,
      });
    } catch (error) {
      next(error);
    }
  };
};

export const getPendingNewPoojaRequests = async (req, res, next) => {
  try {
    const priestId = req.user.id;
    if (!priestId) {
      throw new BadRequestError(
        "Only a registered priest is allowed to perform this action."
      );
    }

    const poojaRequests = await getPendingNewPoojaRequestsService(priestId);

    return res.status(200).json({
      status: 200,
      message: "Pending pooja requests fetched.",
      data: poojaRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const ignorePoojaBookingRequest = async (req, res, next) => {
  try {
    const priestId = req.user.id;
    const { order_id, cancel_reason } = req.body;

    const { error } = cancelPriestPoojaRequestValidation.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    await ignorePoojaBookingRequestService(priestId, order_id, cancel_reason);

    const bookingDetails = await getPoojaBookingDetailsByOrderIdService(order_id);
    if (bookingDetails && bookingDetails.user_id) {
      const userEmailRes = await pool.execute('SELECT email FROM users WHERE id = ?', [bookingDetails.user_id]);
      const userEmail = userEmailRes[0]?.[0]?.email;

      if (userEmail) {
        await sendPriestCancelledEmail(
          userEmail,
          order_id,
          bookingDetails.pooja_name,
          cancel_reason
        );
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Booking request declined and devotee notified.",
    });
  } catch (error) {
    next(error);
  }
};

export const cancelPriestPoojaRequest = async (req, res, next) => {
  try {
    const priestId = req.user.id;
    const { order_id, cancel_reason } = req.body;

    const { error } = cancelPriestPoojaRequestValidation.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    await cancelPriestPoojaRequestService(priestId, order_id, cancel_reason);

    const bookingDetails = await getPoojaBookingDetailsByOrderIdService(order_id);
    if (bookingDetails && bookingDetails.user_id) {
      const userEmailRes = await pool.execute('SELECT email FROM users WHERE id = ?', [bookingDetails.user_id]);
      const userEmail = userEmailRes[0]?.[0]?.email;

      if (userEmail) {
        await sendPriestCancelledEmail(
          userEmail,
          order_id,
          bookingDetails.pooja_name,
          cancel_reason
        );
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Booking cancelled successfully, user has been notified.",
    });
  } catch (error) {
    next(error);
  }
};
