import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import { apiPerformanceMiddleware } from "./src/admin/middlewares/api_performence.middleware.js";
import adminAuthRouter from "./src/admin/routes/admin_auth.routes.js";
import adminBanksRouter from "./src/admin/routes/admin_banks.routes.js";
import adminBookingPoojaRouter from "./src/admin/routes/admin_booking_pooja.routes.js";
import adminDonationsRouter from "./src/admin/routes/admin_donations.routes.js";
import adminHowWePrayRouter from "./src/admin/routes/admin_how_we_pray.routes.js";
import adminOfferingRouter from "./src/admin/routes/admin_offerings.routes.js";
import adminPoojaRouter from "./src/admin/routes/admin_pooja.routes.js";
import adminPriestRouter from "./src/admin/routes/admin_priest.routes.js";
import adminReligionRouter from "./src/admin/routes/admin_religion.routes.js";
import adminFinanceRouter from "./src/admin/routes/admin_sh_finance.routes.js";
import adminSouvernirRouter from "./src/admin/routes/admin_sourvernir.routes.js";
import adminTempleRouter from "./src/admin/routes/admin_temple.routes.js";
import adminUsersManagementRouter from "./src/admin/routes/admin_users_management.routes.js";
import adminPricingConfigRouter from "./src/admin/routes/admin_pricing_config.routes.js";
import systemMetaDataRouter from "./src/admin/routes/system_meta_data.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import authRouter from "./src/routes/auth.routes.js";
import commonContentsRouter from "./src/routes/common_contents.routes.js";
import offeringsRouter from "./src/routes/offerings.routes.js";
import priestPaymentRouter from "./src/routes/payment.routes.js";
import bookingRouter from "./src/routes/pooja_booking.routes.js";
import priestBookingRouter from "./src/routes/priest.booking.routes.js";
import priestRatingRouter from "./src/routes/priest.rating.routes.js";
import priestRouter from "./src/routes/priest.routes.js";
import priestEarningsRouter from "./src/routes/priest_earnings.routes.js";
import priestPoojaRequestRouter from "./src/routes/priest_pooja_request.routes.js";
import ratingRouter from "./src/routes/rating.routes.js";
import userDevoteeRouter from "./src/routes/user_devotee.routes.js";
import userDonationsRouter from "./src/routes/user_donations.routes.js";
import favouritePoojaAndTemplesRouter from "./src/routes/user_favourite_pooja_and_temples.routes.js";
import priestAvailabilityRouter from "./src/routes/priest/availability.routes.js";

const app = express();
app.set("trust proxy", true);

app.use(apiPerformanceMiddleware);

app.use(helmet());

app.use(cors({
  origin: true,
  credentials: true,
}));

// Middleware to handle CORS
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:3002",
//   "http://localhost:3003",
//   "http://localhost:4000",
//   "https://myrituals.org",
//   "https://admin.myrituals.org",
//   "https://priest.myrituals.org",
//   "https://staging.myrituals.org",
//   "https://admin.staging.myrituals.org",
//   "https://priest.staging.myrituals.org",
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, origin); // ✅ IMPORTANT
//     }

//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
// }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "public", "priest_profile_pictures");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/static", express.static("public"));

//! User related routes
app.use("/api/auth", authRouter);
app.use("/api/devotee", userDevoteeRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/favourite", favouritePoojaAndTemplesRouter);
app.use("/api/offerings", offeringsRouter);
app.use("/api/rating", ratingRouter);
app.use("/api/common", commonContentsRouter);
app.use("/api/donations", userDonationsRouter);

//! Priest related routes
app.use("/api/priest/rating", priestRatingRouter);
app.use("/api/priest/request", priestPoojaRequestRouter);
app.use("/api/priest/earnings", priestEarningsRouter);
app.use("/api/priest/booking", priestBookingRouter);
app.use("/api/priest/payment", priestPaymentRouter);
app.use("/api/priest", priestAvailabilityRouter);
app.use("/api/priest", priestRouter);

//! Admin related routes
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/users-management", adminUsersManagementRouter);
app.use("/api/admin/pooja", adminPoojaRouter);
app.use("/api/admin/temples", adminTempleRouter);
app.use("/api/admin/souvenir", adminSouvernirRouter);
app.use("/api/admin/religion", adminReligionRouter);
app.use("/api/system", systemMetaDataRouter);
app.use("/api/admin/how-we-pray", adminHowWePrayRouter);
app.use("/api/admin/priests", adminPriestRouter);
app.use("/api/admin/bookings", adminBookingPoojaRouter);
app.use("/api/admin/offerings", adminOfferingRouter);
app.use("/api/admin/donations", adminDonationsRouter);
app.use("/api/admin/banks", adminBanksRouter);
app.use("/api/admin/finance", adminFinanceRouter);
app.use("/api/admin/pricing-config", adminPricingConfigRouter);

app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "404 Not Found - The requested resource was not found.",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 500, message: "Internal Server Error" });
});

export default app;
