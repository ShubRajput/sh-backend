import razorpay from "../config/payment_gateway.config.js";
import responseConstants from "../constants/response_const.js";
import {
  createUserDonationService,
  updateUserDonationStatusService,
} from "../services/user_donations.service.js";
import { BadRequestError } from "../utils/errors.utils.js";
import {
  createUserDonationSchema,
  verifyDonationPaymentSchema,
} from "../validations/user_donations.validation.js";

export const createUserDonation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const donationData = req.body;
    const { error } = createUserDonationSchema.validate(donationData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { amount, currency } = donationData;

    const razorpayOptions = {
      amount: amount * 100, // Convert to paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(razorpayOptions);

    const result = await createUserDonationService(userId, {
      ...donationData,
      order_id: order.id,
      payment_receipt_id: order.receipt,
    });
    return res.status(201).json({
      status: 201,
      message: responseConstants.DonationCreatedSuccessfully,
      data: result,
    });
  } catch (error) {
    if (error instanceof Object) {
      throw new BadRequestError(
        error.error?.description || error.message || error
      );
    }
    next(error);
  }
};

export const verifyUserDonationPayment = async (req, res, next) => {
  try {
    const { payment_id, order_id, signature } = req.body;

    const { error } = verifyDonationPaymentSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(payment_id);

    //!Check if payment was failed
    if (payment.status === "failed") {
      await updateUserDonationStatusService(order_id, {
        status: "failed",
        payment_id,
      });
      throw new BadRequestError("Payment verification failed");
    }

    //! Check if payment was successful
    else if (payment.status === "captured") {
      // Payment was successful
      // Update donation status in the database
      const result = await updateUserDonationStatusService(order_id, {
        status: "completed",
        payment_id,
        signature,
      });

      return res.status(200).json({
        status: 200,
        message: responseConstants.PaymentVerifiedSuccessfully,
        data: result,
      });
    }

    //! Check if payment is pending
    else if (payment.status === "pending" || payment.status === "created") {
      // Payment is pending
      await updateUserDonationStatusService(order_id, {
        status: "pending",
        payment_id,
      });
      throw new BadRequestError(responseConstants.PaymentPending);
    }

    //! Check if payment is authorized
    else if (payment.status === "authorized") {
      // Payment is authorized
      await updateUserDonationStatusService(order_id, {
        status: "authorized",
        payment_id,
      });
      throw new BadRequestError(responseConstants.PaymentAuthorized);
    }

    //! Check if payment is refunded
    else if (payment.status === "refunded") {
      // Payment is refunded
      await updateUserDonationStatusService(order_id, {
        status: "refunded",
        payment_id,
      });
      throw new BadRequestError(responseConstants.PaymentRefunded);
    } else {
      throw new BadRequestError(responseConstants.PaymentUnknown);
    }
  } catch (error) {
    if (error instanceof Object) {
      throw new BadRequestError(
        error.error?.description || error.message || error
      );
    }
    next(error);
  }
};
