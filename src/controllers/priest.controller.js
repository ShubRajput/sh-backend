import responseConstants from "../constants/response_const.js";
import { assignUserToPreistService } from "../services/auth.service.js";
import {
  addPriestIntroductionService,
  checkIsUserPriestService,
  createPriestService,
  getExistingPriestDetailsService,
  updatePriestProfileDetailsService,
  uploadPriestProfileImageService,
} from "../services/priest.service.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";
import { generateAccessToken } from "../utils/token.util.js";
import {
  addpriestIntroductionValidation,
  createPriestValidation,
  updatePriestProfileDetailsValidation,
} from "../validations/priest.validation.js";

export const createPriest = async (req, res, next) => {
  try {
    const { religion, religion_id, phone_number, temple_id } = req.body;
    const userId = req.user.id;

    const { error } = createPriestValidation.validate(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    await createPriestService(userId, religion, religion_id, phone_number, temple_id);
    await assignUserToPreistService(userId);

    const existingUser = await getExistingPriestDetailsService(userId);

    const accessToken = generateAccessToken({
      id: existingUser.id,
      email: existingUser.email,
      roles: existingUser.roles ? existingUser.roles.split(",") : [],
    });

    return res.status(201).json({
      status: 201,
      message: "User has successfully become a priest.",
      data: {
        access_token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPriestProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profilePicture = req.file;

    if (!profilePicture) {
      throw new BadRequestError("Profile picture is required.");
    }

    const isUserPriest = await checkIsUserPriestService(userId);
    if (!isUserPriest) {
      throw new BadRequestError("User is not a registered priest.");
    }

    const url = profilePicture.location;

    await uploadPriestProfileImageService(userId, url);

    return res.status(200).json({
      status: 200,
      message: "Profile picture uploaded successfully.",
      data: {
        userId,
        profilePicture: url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addPriestIntroduction = async (req, res, next) => {
  try {
    const body = { ...req.body };
    const userId = req.user.id;

    const { error } = addpriestIntroductionValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    await addPriestIntroductionService(userId, body.introduction);

    return res.status(200).json({
      status: 200,
      message: responseConstants.PriestIntroductionAddedSuccessfully,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriestDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await getExistingPriestDetailsService(userId);

    if (!user) {
      throw new NotFoundError(responseConstants.UserNotFound);
    }

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserDetailsFetched,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePriestProfileDetails = async (req, res, next) => {
  try {
    const body = { ...req.body };

    const { error } = updatePriestProfileDetailsValidation.validate(body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    await updatePriestProfileDetailsService(req.user.id, body);

    return res.status(200).json({
      status: 200,
      message: responseConstants.UserProfileDetailsUpdated,
    });
  } catch (error) {
    next(error);
  }
};
