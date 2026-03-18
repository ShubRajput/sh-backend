import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
// import { deleteFileFromS3 } from "../../config/aws.config.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.utils.js";
import {
  addNewReligionImagesService,
  checkReligionExistingDescriptionImagesCountService,
  checkReligionExistingHoverImageStatusService,
  createNewReligionService,
  deleteReligionByKeyService,
  deleteReligionImageByIdService,
  getAllReligionsService,
  getExistingImageDetailsByIdService,
  getReligionByKeyService,
  updateReligionByKeyService,
} from "../services/admin_religion.service.js";
import {
  createNewReligionValidation,
  updateReligionValidation,
} from "../validations/admin_religion.validation.js";

export const createNewReligion = async (req, res, next) => {
  try {
    const religionData = req.body;

    // const images = req.files;

    const { error } = createNewReligionValidation.validate(religionData);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    // if (!images) {
    //   throw new BadRequestError("No images uploaded");
    // }

    // const images_data = [];

    // if (req.files && req.files.hover_image) {
    //   images_data.push({
    //     image_url: req.files.hover_image[0].location,
    //     image_type: "hover",
    //     s3_image_key: req.files.hover_image[0].key,
    //   });
    // }

    // if (req.files && req.files.description_images) {
    //   for (const file of req.files.description_images) {
    //     images_data.push({
    //       image_url: file.location,
    //       image_type: "description",
    //       s3_image_key: file.key,
    //     });
    //   }
    // }

    await createNewReligionService({
      ...religionData,
      // images_data
    });

    return res.status(201).json({
      status: 201,
      message: AdminResponseConstants.ReligionCreatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReligions = async (req, res, next) => {
  try {
    const religions = await getAllReligionsService();
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.ReligionsFetchedSuccessfully,
      data: religions,
    });
  } catch (error) {
    next(error);
  }
};

export const getReligionByKey = async (req, res, next) => {
  try {
    const religionKey = req.params.key;
    const religion = await getReligionByKeyService(religionKey);
    if (!religion) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ReligionNotFound,
      });
    }
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.ReligionFetchedSuccessfully,
      data: religion,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReligionByKey = async (req, res, next) => {
  try {
    const updatedData = req.body;
    const { key } = req.params;
    // const images = req.files;

    const { error } = updateReligionValidation.validate(updatedData);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const existingReligion = await getReligionByKeyService(key);

    if (!existingReligion) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ReligionNotFound,
      });
    }

    // const images_data = [];

    // if (images && images.length > 0) {
    //   if (images.hover_image) {
    //     images_data.push({
    //       image_url: images.hover_image[0].location,
    //       image_type: "hover",
    //       s3_image_key: images.hover_image[0].key,
    //     });
    //   }

    //   if (images.description_images) {
    //     for (const file of images.description_images) {
    //       images_data.push({
    //         image_url: file.location,
    //         image_type: "description",
    //         s3_image_key: file.key,
    //       });
    //     }
    //   }

    //   if (existingReligion.images && existingReligion.images.length > 0) {
    //     for (const image of existingReligion.images) {
    //       //Delete Existing Hover Image
    //       if (images && images.length > 0 && images.hover_image) {
    //         if (image.image_type === "hover") {
    //           await deleteFileFromS3(image.s3_image_key);
    //         }
    //       }

    //       if (images && images.length > 0 && images.description_images) {
    //         if (image.image_type === "description") {
    //           await deleteFileFromS3(image.s3_image_key);
    //         }
    //       }
    //     }
    //   }
    // }

    const newData = {
      ...existingReligion,
      ...updatedData,
    };

    const updatedReligion = await updateReligionByKeyService(key, newData);
    if (!updatedReligion) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ReligionNotFound,
      });
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.ReligionUpdatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReligionByKey = async (req, res, next) => {
  try {
    const religionKey = req.params.key;
    const existingReligion = await getReligionByKeyService(religionKey);
    if (!existingReligion) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ReligionNotFound,
      });
    }

    const { images } = existingReligion;

    if (images && images.length > 0) {
      // Delete images from S3
      for (const image of images) {
        // await deleteFileFromS3(image.s3_image_key);
      }
    }

    const deleted = await deleteReligionByKeyService(religionKey);
    if (!deleted) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ReligionNotFound,
      });
    }
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.ReligionDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReligionImageById = async (req, res, next) => {
  try {
    const imageId = req.params.id;
    const existingImage = await getExistingImageDetailsByIdService(imageId);

    if (!existingImage) {
      throw new NotFoundError(AdminResponseConstants.ImageNotFound);
    }

    const deleted = await deleteReligionImageByIdService(imageId);
    if (!deleted) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ImageNotFound,
      });
    }

    // await deleteFileFromS3(existingImage.s3_image_key);
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.ImageDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadReligionImage = async (req, res, next) => {
  try {
    const religionKey = req.params.key;

    const existingReligion = await getReligionByKeyService(religionKey);
    if (!existingReligion) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ReligionNotFound,
      });
    }

    const images = req.files;
    const images_data = [];

    if (images) {
      if (images.hover_image) {
        const isHoverImageExists =
          await checkReligionExistingHoverImageStatusService(
            existingReligion.id
          );

        if (isHoverImageExists) {
          throw new BadRequestError("Hover image already exists");
        } else {
          images_data.push({
            image_url: images.hover_image[0].location,
            image_type: "hover",
            s3_image_key: images.hover_image[0].key,
          });
        }
      }

      if (images.description_images) {
        const existingDescriptionImagesCount =
          await checkReligionExistingDescriptionImagesCountService(
            existingReligion.id
          );

        if (
          existingDescriptionImagesCount + images.description_images.length >
          9
        ) {
          throw new BadRequestError(
            "Maximum description images limit reached. You can upload up to 9 images."
          );
        }

        for (const file of images.description_images) {
          images_data.push({
            image_url: file.location,
            image_type: "description",
            s3_image_key: file.key,
          });
        }
      }
    }

    await addNewReligionImagesService(existingReligion.id, {
      images: images_data,
    });

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.ImageUploadedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};
