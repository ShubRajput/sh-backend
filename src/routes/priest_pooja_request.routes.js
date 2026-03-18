import express from 'express';

import {
  getPendingNewPoojaRequests,
  getPoojaRequestByStatus,
  handlePriestPoojaRequest,
  ignorePoojaBookingRequest,
  updateAcceptedPoojaRequest,
  cancelPriestPoojaRequest,
} from '../controllers/priest_pooja_request.controller.js';
import {
  authenticateToken,
  authorizeRoles,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// Update pooja status (accepted) and upload pooja url
router.put(
  "/handle-request",
  authenticateToken,
  authorizeRoles("priest"),
  handlePriestPoojaRequest
);
router.put(
  "/cancel-request",
  authenticateToken,
  authorizeRoles("priest"),
  updateAcceptedPoojaRequest("cancelled")
);
router.put(
  "/cancel-booking",
  authenticateToken,
  authorizeRoles("priest"),
  cancelPriestPoojaRequest
);
router.put(
  "/complete-request",
  authenticateToken,
  authorizeRoles("priest"),
  updateAcceptedPoojaRequest("completed")
);
router.get(
  "/accepted-request",
  authenticateToken,
  authorizeRoles("priest"),
  getPoojaRequestByStatus
);
router.get(
  "/new-requests",
  authenticateToken,
  authorizeRoles("priest"),
  getPendingNewPoojaRequests
);

router.post(
  "/ignore-request",
  authenticateToken,
  authorizeRoles("priest"),
  ignorePoojaBookingRequest
);

export default router;
