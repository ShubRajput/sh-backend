import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
import {
  createNewPoojaService,
  deletePoojaByIdService,
  getAllPoojasService,
  getPoojaByKeyService,
  getPoojaDetailsByIdService,
  updatePoojaByIdService,
} from "../../admin/services/admin_pooja.service.js";
import {
  createPoojaValidation,
  updatePoojaValidation,
} from "../../admin/validations/admin_pooja.validation.js";
// import { deleteFileFromS3 } from "../../config/aws.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";

export const createNewPooja = async (req, res, next) => {
  try {
    const poojaData = req.body;
    const poojaImage = req.file;

    if (!poojaImage) {
      throw new BadRequestError("Pooja image is required");
    }

    const { error } = createPoojaValidation.validate(poojaData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (poojaImage) {
      poojaData.image_url = poojaImage.location;
      poojaData.s3_image_key = poojaImage.key;
    }

    const newPooja = await createNewPoojaService(poojaData);

    return res.status(201).json({
      status: 201,
      message: AdminResponseConstants.PoojaCreatedSuccessfully,
      data: newPooja,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPoojas = async (req, res, next) => {
  try {
    const religionId = req.query.religion_id;

    if (!religionId) {
      throw new BadRequestError("Religion ID is required");
    }

    const poojas = await getAllPoojasService(religionId);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.PoojasRetrievedSuccessfully,
      data: poojas,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePoojaById = async (req, res, next) => {
  try {
    const poojaId = req.params.id;

    if (!poojaId) {
      throw new BadRequestError("Pooja ID is required");
    }

    const existingPooja = await getPoojaDetailsByIdService(poojaId);

    if (!existingPooja) {
      throw new BadRequestError("Pooja not found");
    }

    // await deleteFileFromS3(existingPooja.s3_image_key);
    const deletedPooja = await deletePoojaByIdService(poojaId);

    if (!deletedPooja) {
      throw new BadRequestError("Pooja not found or already deleted");
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.PoojaDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePoojaById = async (req, res, next) => {
  try {
    const poojaId = req.params.id;
    const poojaData = req.body;
    const poojaImage = req.file;

    if (!poojaId) {
      throw new BadRequestError("Pooja ID is required");
    }

    const { error } = updatePoojaValidation.validate(poojaData);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const existingPooja = await getPoojaDetailsByIdService(poojaId);

    if (!existingPooja) {
      throw new BadRequestError("Pooja not found");
    }

    if (poojaImage) {
      poojaData.image_url = poojaImage.location;
      poojaData.s3_image_key = poojaImage.key;
    } else {
      poojaData.s3_image_key = existingPooja.s3_image_key;
      poojaData.image_url = existingPooja.image_url;
    }

    const updatedPooja = await updatePoojaByIdService(poojaId, poojaData);

    if (poojaImage && existingPooja.s3_image_key) {
      // await deleteFileFromS3(existingPooja.s3_image_key);
    }

    if (!updatedPooja) {
      throw new BadRequestError("Pooja not found or already updated");
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.PoojaUpdatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const getPoojaByKey = async (req, res, next) => {
  try {
    const poojaKey = req.params.pooja_key;

    if (!poojaKey) {
      throw new BadRequestError("Pooja key is required");
    }

    const poojaDetails = await getPoojaByKeyService(poojaKey);

    if (!poojaDetails) {
      throw new BadRequestError("Pooja not found");
    }

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.PoojasRetrievedSuccessfully,
      data: poojaDetails,
    });
  } catch (error) {
    next(error);
  }
};
