import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
// import { deleteFileFromS3 } from "../../config/aws.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import {
  createAdminDonationContentService,
  deleteAdminDonationContentByIdService,
  getAllAdminDonationContentsService,
  getAllUsersDonationsService,
  getExistingDonationContentByDonationIdService,
  updateAdminDonationContentByIdService,
} from "../services/admin_donations.service.js";
import {
  createAdminDonationValidationSchema,
  updateAdminDonationValidationSchema,
} from "../validations/admin_donations.validation.js";

export const getAllUsersDonations = async (req, res, next) => {
  try {
    const period = req.query.period;
    const religionId = req.query.religion_id;

    const donations = await getAllUsersDonationsService(period, religionId);
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.DonationsFetchedSuccessfully,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminDonationContent = async (req, res, next) => {
  try {
    const donationData = req.body;
    const donationImage = req.file;

    if (!donationImage) {
      throw new BadRequestError("Donation image is required");
    }

    const { error } =
      createAdminDonationValidationSchema.validate(donationData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (donationImage) {
      donationData.image_url = donationImage.location;
      donationData.s3_image_key = donationImage.key;
    }

    const donation = await createAdminDonationContentService(donationData);
    return res.status(201).json({
      status: 201,
      message: AdminResponseConstants.DonationCreatedSuccessfully,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdminDonationContents = async (req, res, next) => {
  try {
    const religionId = req.query.religion_id;

    if (!religionId) {
      throw new BadRequestError("Religion ID is required");
    }

    const donations = await getAllAdminDonationContentsService(religionId);
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.DonationsFetchedSuccessfully,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminDonationContentById = async (req, res, next) => {
  try {
    const donationId = req.params.donation_id;

    const existingDonationContent =
      await getExistingDonationContentByDonationIdService(donationId);

    if (!existingDonationContent) {
      throw new BadRequestError("Donation content not found");
    }

    const result = await deleteAdminDonationContentByIdService(donationId);

    if (!result) {
      throw new BadRequestError("Failed to delete donation content");
    }

    // await deleteFileFromS3(existingDonationContent.s3_image_key);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.DonationDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminDonationContentById = async (req, res, next) => {
  try {
    const donationId = req.params.donation_id;
    const donationData = req.body;
    const donationImage = req.file;

    const { error } =
      updateAdminDonationValidationSchema.validate(donationData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingDonationContent =
      await getExistingDonationContentByDonationIdService(donationId);

    if (!existingDonationContent) {
      throw new BadRequestError("Donation content not found");
    }

    if (donationImage) {
      donationData.image_url = donationImage.location;
      donationData.s3_image_key = donationImage.key;
      if (existingDonationContent.s3_image_key) {
        // await deleteFileFromS3(existingDonationContent.s3_image_key);
      }
    } else {
      donationData.image_url = existingDonationContent.image_url;
      donationData.s3_image_key = existingDonationContent.s3_image_key;
    }

    const result = await updateAdminDonationContentByIdService(
      donationId,
      donationData
    );

    if (!result) {
      throw new BadRequestError("Failed to update donation content");
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.DonationUpdatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};
