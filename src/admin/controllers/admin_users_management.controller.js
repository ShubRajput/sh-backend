import AdminResponseConst from "../constants/admin_response_const.js";
import {
  approveAdminService,
  getAllUsersService,
  getPendingAdminsService,
  updateUserSuspendedStatusService,
} from "../services/admin_users_management.service.js";
import { updateUserSuspendedStatusValidation } from "../validations/admin_features.validation.js";
import { approveAdminValidation } from "../validations/admin_users_management.validation.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(403).json({
        status: 403,
        message: AdminResponseConst.AccessDenied,
      });
    }
    const users = await getAllUsersService();
    return res.status(200).json({
      status: 200,
      message: AdminResponseConst.UsersFetchedSuccessfully,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserSuspendedStatus = async (req, res, next) => {
  try {
    const admin = req.admin;
    const { userId, isSuspended } = req.body;

    if (!admin) {
      return res.status(403).json({
        status: 403,
        message: AdminResponseConst.AccessDenied,
      });
    }

    const { error } = updateUserSuspendedStatusValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    await updateUserSuspendedStatusService(userId, isSuspended);

    return res.status(200).json({
      status: 200,
      message: AdminResponseConst.UserSuspendedStatusUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingAdmins = async (req, res, next) => {
  try {
    const adminRes = await getPendingAdminsService();
    return res.status(200).json({
      status: 200,
      message: "Pending admins fetched successfully",
      data: {
        pendingAdmins: adminRes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const approveAdmin = async (req, res, next) => {
  try {
    const { admin_id, is_approved } = req.body;

    const { error } = approveAdminValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const result = await approveAdminService(admin_id, is_approved);

    if (!result) {
      return res.status(404).json({
        status: 404,
        message: "Admin not found",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Admin approval status changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
