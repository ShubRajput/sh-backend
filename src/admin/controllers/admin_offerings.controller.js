import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
// import { deleteFileFromS3 } from "../../config/aws.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import {
  createNewAdminOfferingService,
  deleteAdminOfferingByIdService,
  deleteAdminOfferingImageByIdService,
  getAdminOfferingDetailsByIdService,
  getAdminOfferingImageDetailsByOfferingIdAndImageTypeService,
  getAllAdminOfferingsService,
  getExistingAdminOfferingImageDetailsByIdService,
  getOfferingsFinancialDetailsService,
  updateAdminOfferingByIdService,
  uploadAdminOfferingImageService,
} from "../services/admin_offerings.service.js";
import {
  createNewAdminOfferingValidationSchema,
  updateAdminOfferingValidationSchema,
} from "../validations/admin_offering.validation.js";

export const createAdminOffering = async (req, res, next) => {
  try {
    const offeringData = req.body;
    const images = req.files;

    const { error } =
      createNewAdminOfferingValidationSchema.validate(offeringData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!images) {
      throw new BadRequestError("No images uploaded");
    }

    const images_data = [];

    if (images && images.profile_offering) {
      images_data.push({
        image_url: images.profile_offering[0].location,
        image_type: "profile_offering",
        s3_image_key: images.profile_offering[0].key,
      });
    }

    if (images && images.description_offering) {
      for (const image of images.description_offering) {
        images_data.push({
          image_url: image.location,
          image_type: "description_offering",
          s3_image_key: image.key,
        });
      }
    }

    await createNewAdminOfferingService({ ...offeringData, images_data });

    return res.status(201).json({
      status: 201,
      message: AdminResponseConstants.OfferingCreatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdminOfferings = async (req, res, next) => {
  try {
    const religionId = req.query.religion_id;

    if (!religionId) {
      throw new BadRequestError("Religion ID is required");
    }

    const offerings = await getAllAdminOfferingsService(religionId);
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.OfferingsFetchedSuccessfully,
      data: offerings,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminOfferingById = async (req, res, next) => {
  try {
    const offeringId = req.params.id;

    const existingOffering = await getAdminOfferingDetailsByIdService(
      offeringId
    );

    if (!existingOffering) {
      throw new BadRequestError("Offering not found");
    }

    if (existingOffering.images && existingOffering.images.length > 0) {
      // Delete images from S3
      for (const image of existingOffering.images) {
        // await deleteFileFromS3(image.s3_image_key);
      }
    }

    await deleteAdminOfferingByIdService(offeringId);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.OfferingDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminOfferingById = async (req, res, next) => {
  try {
    const offeringId = req.params.id;
    const offeringData = req.body;

    const { error } =
      updateAdminOfferingValidationSchema.validate(offeringData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingOffering = await getAdminOfferingDetailsByIdService(
      offeringId
    );

    if (!existingOffering) {
      throw new BadRequestError("Offering not found");
    }

    await updateAdminOfferingByIdService(offeringId, {
      ...offeringData,
    });

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.OfferingUpdatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminOfferingImageById = async (req, res, next) => {
  try {
    const imageId = req.params.id;

    const existingImage = await getExistingAdminOfferingImageDetailsByIdService(
      imageId
    );

    if (!existingImage) {
      throw new BadRequestError("Image not found");
    }

    const isDeleted = await deleteAdminOfferingImageByIdService(imageId);

    if (!isDeleted) {
      throw new BadRequestError("Image not found");
    }

    // await deleteFileFromS3(existingImage.s3_image_key);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.OfferingImageDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAdminOfferingImage = async (req, res, next) => {
  try {
    const offeringId = req.params.id;

    const existingOffering = await getAdminOfferingDetailsByIdService(
      offeringId
    );
    if (!existingOffering) {
      throw new BadRequestError("Offering not found");
    }

    const images = req.files;

    if (!images || images.length === 0) {
      throw new BadRequestError("No images uploaded");
    }

    const images_data = [];

    //! Check profile offering image
    if (images && images.profile_offering) {
      const existingProfileOfferingImage =
        await getAdminOfferingImageDetailsByOfferingIdAndImageTypeService(
          offeringId,
          "profile_offering"
        );

      if (existingProfileOfferingImage) {
        throw new BadRequestError(
          "Profile offering image already exists. Please delete existing image before uploading a new one."
        );
      } else {
        images_data.push({
          image_url: images.profile_offering[0].location,
          image_type: "profile_offering",
          s3_image_key: images.profile_offering[0].key,
          offering_id: offeringId,
        });
      }
    }

    //! Check description offering images
    if (images && images.description_offering) {
      const existingDescriptionOfferingImages =
        await getAdminOfferingImageDetailsByOfferingIdAndImageTypeService(
          offeringId,
          "description_offering"
        );

      if (
        existingDescriptionOfferingImages.length +
          images.description_offering.length >
        9
      ) {
        throw new BadRequestError(
          "Maximum description offering images limit reached. You can upload up to 9 images."
        );
      } else {
        for (const image of images.description_offering) {
          images_data.push({
            offering_id: offeringId,
            image_url: image.location,
            image_type: "description_offering",
            s3_image_key: image.key,
          });
        }
      }
    }

    for (const image of images_data) {
      await uploadAdminOfferingImageService(image);
    }

    return res.status(201).json({
      status: 201,
      message: AdminResponseConstants.OfferingImageUploadedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const getOfferingsFinancialDetails = async (req, res, next) => {
  try {
    const { religion_id, period } = req.query;

    const result = await getOfferingsFinancialDetailsService(
      religion_id,
      period
    );
    return res.status(200).json({
      status: 200,
      message: "Offerings financial details fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
