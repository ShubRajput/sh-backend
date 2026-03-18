// import { deleteFileFromS3 } from "../../config/aws.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";
import AdminResponseConstants from "../constants/admin_response_const.js";
import {
  createSouvernirService,
  deleteSouvernirByIdService,
  getAllSouvernirsService,
  getSouvernirByIdService,
  getSouvernirDetailsByKeyService,
  updateSouvernirByIdService,
} from "../services/admin_souvernir.service.js";
import {
  createSouvernirValidation,
  updateSouvernirValidation,
} from "../validations/admin_souvernir.validation.js";

export const createSouvernir = async (req, res, next) => {
  try {
    const souvData = req.body;

    const souvImage = req.file;

    // Validate the request body
    const { error } = createSouvernirValidation.validate(souvData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (!souvImage) {
      throw new BadRequestError(
        AdminResponseConstants.SouvernirImageIsRequired
      );
    }
    const allData = {
      ...souvData,
      image_url: souvImage.location,
      s3_image_key: souvImage.key,
    };

    // Call the service to create the souv
    await createSouvernirService(allData);

    return res.status(201).json({
      status: 201,
      message: AdminResponseConstants.SouvernirCreated,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSouvernirs = async (req, res, next) => {
  try {
    const religionId = req.query.religion_id;

    if (!religionId) {
      throw new BadRequestError("Religion ID is required");
    }

    // Call the service to get all souvernirs
    const souvernirs = await getAllSouvernirsService(religionId);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.SouvernirsFetched,
      data: souvernirs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSouvernirById = async (req, res, next) => {
  try {
    const { souv_id } = req.params;

    if (!souv_id) {
      throw new BadRequestError("Souvernir ID is required");
    }

    const existingSouv = await getSouvernirByIdService(souv_id);

    if (!existingSouv) {
      throw new BadRequestError("Souvernir not found");
    }

    // await deleteFileFromS3(existingSouv.s3_image_key);

    const result = await deleteSouvernirByIdService(souv_id);

    if (!result) {
      throw new BadRequestError("Souvernir not found or could not be deleted");
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.SouvernirDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSouvernirById = async (req, res, next) => {
  try {
    const { souv_id } = req.params;
    const souvData = req.body;
    const souvImage = req.file;

    if (!souv_id) {
      throw new BadRequestError("Souvernir ID is required");
    }

    // Validate the request body
    const { error } = updateSouvernirValidation.validate(souvData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingSouv = await getSouvernirByIdService(souv_id);

    if (!existingSouv) {
      throw new BadRequestError("Souvernir not found");
    }

    const allData = {
      ...souvData,
      s3_image_key: existingSouv.s3_image_key,
      image_url: existingSouv.image_url,
    };

    if (souvImage) {
      allData.image_url = souvImage.location;
      allData.s3_image_key = souvImage.key;

      if (existingSouv.s3_image_key) {
        // await deleteFileFromS3(existingSouv.s3_image_key);
      }
    }

    // Call the service to update the souv
    await updateSouvernirByIdService(souv_id, allData);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.SouvernirUpdatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const getSouvernirDetailsByKey = async (req, res, next) => {
  try {
    const { souv_key } = req.params;

    if (!souv_key) {
      throw new BadRequestError("Souvernir key is required");
    }

    // Call the service to get souv details by key
    const souvDetails = await getSouvernirDetailsByKeyService(souv_key);

    if (!souvDetails) {
      throw new BadRequestError("Souvernir not found");
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.SouvernirDetailsFetched,
      data: souvDetails,
    });
  } catch (error) {
    next(error);
  }
};
