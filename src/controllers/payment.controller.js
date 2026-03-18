import responseConstants from "../constants/response_const.js";
import {
  addPaymentDetailsService,
  getAllPaymentDetailsService,
  updatePaymentDetailsService,
} from "../services/payment.service.js";
import { BadRequestError } from "../utils/errors.utils.js";
import { decrypt, encrypt } from "../utils/payment.utils.js";
import {
  addPaymentDetailsValidation,
  updatePaymentDetailsValidation,
} from "../validations/payment.validation.js";

export const addPaymentDetails = async (req, res, next) => {
  try {
    let body = { ...req.body };
    const userId = req.user.id;

    const { error } = addPaymentDetailsValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const encryptedBody = {
      ...body,
      account_holder_name: encrypt(body.account_holder_name),
      bank_name: encrypt(body.bank_name),
      branch_name: encrypt(body.branch_name),
      account_number: encrypt(body.account_number),
    };

    const paymentDetails = await addPaymentDetailsService(
      userId,
      encryptedBody
    );

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserPaymentDetailsAddedSuccessfully,
      data: paymentDetails,
    });
  } catch (error) {
    console.error("Error adding payment details:", error);
    next(error);
  }
};

export const updatePaymentDetails = async (req, res, next) => {
  try {
    const { paymentDetailsId } = req.query;
    const body = { ...req.body };

    if (!paymentDetailsId) {
      throw new BadRequestError("Payment Detail ID is required");
    }

    const { error } = updatePaymentDetailsValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const encryptedBody = {
      ...body,
      account_holder_name: encrypt(body.account_holder_name),
      bank_name: encrypt(body.bank_name),
      branch_name: encrypt(body.branch_name),
      account_number: encrypt(body.account_number),
    };

    const updatedPaymentDetails = await updatePaymentDetailsService(
      paymentDetailsId,
      encryptedBody
    );

    if (!updatedPaymentDetails) {
      throw new BadRequestError(
        "Payment details not found or could not be updated"
      );
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserPaymentDetailsUpdatedSuccessfully,
      data: updatedPaymentDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPaymentDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const encryptedAccounts = await getAllPaymentDetailsService(userId);

    const decryptedAccounts = encryptedAccounts.map((account) => ({
      ...account,
      account_holder_name: decrypt(account.account_holder_name),
      bank_name: decrypt(account.bank_name),
      branch_name: decrypt(account.branch_name),
      account_number: decrypt(account.account_number),
    }));

    return res.status(200).json({
      status: 200,
      message: responseConstants.AccountDetailsFetched,
      data: decryptedAccounts,
    });
  } catch (error) {
    next(error);
  }
};
