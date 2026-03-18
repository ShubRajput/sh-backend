import responseConstants from "../constants/response_const.js";
import {
  getAllBanksService,
  getDonationDetailsListService,
  getHowWePrayListService,
  getOfferingsListService,
  getPoojaListService,
  getReligionDetailsByIdService,
  getReligionListService,
  getSouvernirsListService,
  getTempleListService,
} from "../services/common_contents.service.js";
import { BadRequestError } from "../utils/errors.utils.js";

export const getReligionList = async (req, res, next) => {
  try {
    const religionList = await getReligionListService();

    return res.status(200).json({
      status: 200,
      message: responseConstants.ReligionsFetchSuccess,
      data: religionList,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTemples = async (req, res, next) => {
  try {
    const { religion_id } = req.query;

    if (!religion_id) {
      throw new BadRequestError("Religion ID is required");
    }

    const templeList = await getTempleListService(religion_id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: templeList,
    });
  } catch (error) {
    next(error);
  }
};

export const getHowWePrayList = async (req, res, next) => {
  try {
    const { religion_id } = req.query;

    if (!religion_id) {
      throw new BadRequestError("Religion ID is required");
    }

    const howWePrayList = await getHowWePrayListService(religion_id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: howWePrayList,
    });
  } catch (error) {
    next(error);
  }
};

export const getSouvernirsList = async (req, res, next) => {
  try {
    const { religion_id } = req.query;

    if (!religion_id) {
      throw new BadRequestError("Religion ID is required");
    }

    const souvernirsList = await getSouvernirsListService(religion_id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: souvernirsList,
    });
  } catch (error) {
    next(error);
  }
};

export const getPoojaList = async (req, res, next) => {
  try {
    const { religion_id, is_featured } = req.query;

    if (!religion_id) {
      throw new BadRequestError("Religion ID is required");
    }

    const poojaList = await getPoojaListService(religion_id, is_featured);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: poojaList,
    });
  } catch (error) {
    next(error);
  }
};

export const getOfferingsList = async (req, res, next) => {
  try {
    const { religion_id } = req.query;

    if (!religion_id) {
      throw new BadRequestError("Religion ID is required");
    }

    const offeringsList = await getOfferingsListService(religion_id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: offeringsList,
    });
  } catch (error) {
    next(error);
  }
};

export const getDonationsList = async (req, res, next) => {
  try {
    const { religion_id } = req.query;

    if (!religion_id) {
      throw new BadRequestError("Religion ID is required");
    }

    const donationsList = await getDonationDetailsListService(religion_id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: donationsList,
    });
  } catch (error) {
    next(error);
  }
};

export const getReligionDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Religion ID is required");
    }

    const religionDetails = await getReligionDetailsByIdService(id);

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: religionDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBanks = async (req, res, next) => {
  try {
    const banksList = await getAllBanksService();

    return res.status(200).json({
      status: 200,
      message: responseConstants.DataFetchSuccess,
      data: banksList,
    });
  } catch (error) {
    next(error);
  }
};
