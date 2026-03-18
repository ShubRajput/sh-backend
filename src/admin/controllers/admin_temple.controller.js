// import { deleteFileFromS3 } from "../../config/aws.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import responseConstants from "../constants/admin_response_const.js";
import {
  createNewTempleService,
  deleteTempleByIdService,
  getTempleByIdService,
  getTempleDetailsByKeyService,
  getTemplesDetailsService,
  updateTempleByIdService,
} from "../services/admin_temple.service.js";
import { createNewTempleValidation } from "../validations/admin_temple.validation.js";

export const createNewTemple = async (req, res, next) => {
  try {
    const templeData = req.body;
    const templeImage = req.file;

    // Validate the input data
    const { error } = createNewTempleValidation.validate(templeData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!templeImage) {
      throw new BadRequestError(responseConstants.TempleImageIsRequired);
    }

    const allData = {
      ...templeData,
      image_url: templeImage.location,
      s3_image_key: templeImage.key,
    };

    // Call the service to create a new temple
    const newTemple = await createNewTempleService(allData);

    return res.status(201).json({
      status: 201,
      message: responseConstants.TempleCreated,
      data: newTemple,
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplesDetails = async (req, res, next) => {
  try {
    const religionId = req.query.religion_id;

    if (!religionId) {
      throw new BadRequestError("Religion ID is required");
    }

    // Call the service to get temples details
    const templesDetails = await getTemplesDetailsService(religionId);

    return res.status(200).json({
      status: 200,
      message: responseConstants.TemplesDetailsFetched,
      data: templesDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTempleById = async (req, res, next) => {
  try {
    const templeId = req.params.id;

    const existingTemple = await getTempleByIdService(templeId);

    if (!existingTemple) {
      throw new BadRequestError(responseConstants.TempleNotFound);
    }

    // Call the service to delete the temple by ID
    await deleteTempleByIdService(templeId);
    // await deleteFileFromS3(existingTemple.s3_image_key);

    return res.status(200).json({
      status: 200,
      message: responseConstants.TempleDeleted,
    });
  } catch (error) {
    next(error);
  }
};

export const getTempleDetailsByKey = async (req, res, next) => {
  try {
    const templeKey = req.params.temple_key;

    // Validate the temple key
    if (!templeKey) {
      throw new BadRequestError("Temple key is required");
    }

    // Call the service to get temple details by key
    const templeDetails = await getTempleDetailsByKeyService(templeKey);

    if (!templeDetails) {
      throw new BadRequestError("Temple not found");
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.TempleDetailsFetched,
      data: templeDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTempleById = async (req, res, next) => {
  try {
    const templeId = req.params.id;
    const templeData = req.body;
    const templeImage = req.file;

    // Validate the input data
    const { error } = createNewTempleValidation.validate(templeData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (templeImage) {
      templeData.image_url = templeImage.location;
      templeData.s3_image_key = templeImage.key;
    }

    const existingTemple = await getTempleByIdService(templeId);

    if (!existingTemple) {
      throw new BadRequestError(responseConstants.TempleNotFound);
    }

    // Call the service to update the temple by ID
    const updatedTemple = await updateTempleByIdService(templeId, templeData);

    if (templeImage && existingTemple.s3_image_key) {
      // await deleteFileFromS3(existingTemple.s3_image_key);
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.TempleUpdatedSuccessfully,
      data: updatedTemple,
    });
  } catch (error) {
    next(error);
  }
};
