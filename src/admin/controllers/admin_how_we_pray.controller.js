import AdminResponseConstants from "../../admin/constants/admin_response_const.js";
// import { deleteFileFromS3 } from "../../config/aws.config.js";
import {
  createHowWePrayService,
  deleteHowWePrayService,
  getAllHowWePrayService,
  getHowWePrayByIdService,
  updateHowWePrayByIdService,
} from "../services/admin_how_we_pray.service.js";
import { createHowWePrayValidationSchema } from "../validations/admin_how_we_pray.validation.js";

export const createHowWePray = async (req, res, next) => {
  try {
    const data = req.body;

    const prayImage = req.file;

    if (!prayImage) {
      return res.status(400).json({
        status: 400,
        message: AdminResponseConstants.PrayImageIsRequired,
      });
    }

    const { error } = createHowWePrayValidationSchema.validate(data);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }
    const howWePrayData = {
      ...data,
      image_url: prayImage.location,
      s3_image_key: prayImage.key,
    };
    const result = await createHowWePrayService(howWePrayData);
    return res.status(201).json({
      status: 201,
      message: AdminResponseConstants.HowWePrayCreatedSuccessfully,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHowWePray = async (req, res, next) => {
  try {
    const { religion_id } = req.query;

    if (!religion_id) {
      return res.status(400).json({
        status: 400,
        message: "Religion ID is required",
      });
    }

    const result = await getAllHowWePrayService(religion_id);
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.HowWePrayFetchedSuccessfully,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHowWePrayById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existValue = await getHowWePrayByIdService(id);
    if (!existValue) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ItemNotFound,
      });
    }
    // await deleteFileFromS3(existValue.s3_image_key);
    await deleteHowWePrayService(id);
    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.HowWePrayDeletedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHowWePrayById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const prayImage = req.file;

    const { error } = createHowWePrayValidationSchema.validate(data);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const existValue = await getHowWePrayByIdService(id);

    if (!existValue) {
      return res.status(404).json({
        status: 404,
        message: AdminResponseConstants.ItemNotFound,
      });
    }

    const updatedData = {
      ...existValue,
      ...data,
    };

    if (prayImage) {
      if (existValue.s3_image_key) {
        // await deleteFileFromS3(existValue.s3_image_key);
      }

      updatedData.image_url = prayImage.location;
      updatedData.s3_image_key = prayImage.key;
    }

    await updateHowWePrayByIdService(id, updatedData);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConstants.HowWePrayUpdatedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};
