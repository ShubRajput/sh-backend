import razorpay from '../config/payment_gateway.config.js';
import responseConstants from '../constants/response_const.js';
import {
  getAllOfferingsService,
  getOfferingBasicDetailsService,
  getOfferingsByIdService,
  submitUserOfferingService,
  updateUserOfferingService,
} from '../services/offerings.service.js';
import { BadRequestError } from '../utils/errors.utils.js';
import {
  submitUserOfferingValidation,
  verifyUserOfferingPaymentSchema,
} from '../validations/offerings.validation.js';

export const getAllOfferings = async (req, res, next) => {
  try {
    const { religion_id } = req.query;
    const Offerings = await getAllOfferingsService(religion_id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.OfferingsFetched,
      data: Offerings,
    });
  } catch (error) {
    next(error);
  }
};

export const getOfferingsById = async (req, res, next) => {
  try {
    const { offeringId } = req.params;

    if (!offeringId) {
      throw new BadRequestError(responseConstants.OfferingsIDNotFound);
    }

    const offeringsDetails = await getOfferingsByIdService(offeringId);

    if (!offeringsDetails) {
      throw new BadRequestError(responseConstants.OfferingsNotFound);
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.OfferingsDetailsRequired,
      data: offeringsDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const submitUserOffering = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const offeringData = req.body;

    const { error } = submitUserOfferingValidation.validate(offeringData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { currency, offering_items } = offeringData;

    if (!offering_items || offering_items.length === 0) {
      throw new BadRequestError("Offering items are required");
    }
    let totalAmount = 0;
    for (const item of offering_items) {
      const { offering_id } = item;
      const offeringDetails = await getOfferingBasicDetailsService(offering_id);
      if (!offeringDetails) {
        throw new BadRequestError(`Offering with ID ${offering_id} not found`);
      }
      totalAmount += offeringDetails.price * item.quantity;
    }

    const razorpayOptions = {
      amount: totalAmount * 100, // Convert to paise
      currency: currency || "INR",
      receipt: `OFF-${Date.now()}`,
    };

    const paymentResponse = await razorpay.orders.create(razorpayOptions);

    const result = await submitUserOfferingService(userId, {
      ...offeringData,
      amount: totalAmount,
      order_id: paymentResponse.id,
      payment_receipt_id: paymentResponse.receipt,
    });

    return res.status(201).json({
      status: 201,
      message: responseConstants.OfferCreatedSuccessfully,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUserOfferingPayment = async (req, res, next) => {
  try {
    const { payment_id, order_id, signature } = req.body;

    const { error } = verifyUserOfferingPaymentSchema.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    //! Verify payment with razorpay
    const payment = await razorpay.payments.fetch(payment_id);

    //! Check if payment was failed
    if (payment.status === "failed") {
      await updateUserOfferingService(order_id, {
        status: "failed",
        payment_id,
        signature,
      });
      throw new BadRequestError("Payment verification failed");
    }
    //! Check if payment was successful
    else if (payment.status === "captured") {
      await updateUserOfferingService(order_id, {
        status: "completed",
        payment_id,
        signature,
      });
      return res.status(200).json({
        status: 200,
        message: responseConstants.PaymentVerifiedSuccessfully,
      });
    }

    //! Check if payment is pending
    else if (payment.status === "pending" || payment.status === "created") {
      await updateUserOfferingService(order_id, {
        status: "pending",
        payment_id,
        signature,
      });
      throw new BadRequestError(responseConstants.PaymentPending);
    }

    //! Check if payment is authorized
    else if (payment.status === "authorized") {
      await updateUserOfferingService(order_id, {
        status: "authorized",
        payment_id,
        signature,
      });
      throw new BadRequestError(responseConstants.PaymentAuthorized);
    }

    //! Check if payment is refunded
    else if (payment.status === "refunded") {
      await updateUserOfferingService(order_id, {
        status: "refunded",
        payment_id,
        signature,
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
