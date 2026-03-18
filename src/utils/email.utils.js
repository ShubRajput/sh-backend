import nodemailer from "nodemailer";

import envConfig from "../config/env.config.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: envConfig.EMAIL_USER,
    pass: envConfig.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (e) => {
  const mail = {
    from: envConfig.EMAIL_USER,
    to: e.userId,
    subject: e.subject,
    html: e.message,
  };
  try {
    await transporter.sendMail(mail);
  } catch (e) {
    throw new Error("Could not send email");
  }
};

export const sendOrderConformationEmail = async (orderDetails) => {
  const {
    user_email,
    order_id,
    pooja_date,
    pooja_time,
    mode_of_pooja,
    number_of_devotees,
    tax,
    service_charge,
    total_price,
  } = orderDetails;
  const mail = {
    from: envConfig.EMAIL_USER,
    to: user_email,
    subject: "Payment Confirmation!",
    html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Confirmation!</title>
  </head>
  <body style="font-family: Arial, sans-serif">
    <h1 style="color: #bd803a">Payment Confirmation!</h1>
    <p>
      Thank you for your payment. Your transaction has been successfully
      processed.
    </p>
    <br/>
    <h2>Order Summary</h2>
    <p><strong>Booking Ticket Id:</strong> ${order_id}</p>
    <p><strong>Date:</strong> ${pooja_date}</p>
    <p><strong>Time:</strong> ${pooja_time}</p>
    <p><strong>Pooja Mode:</strong> ${mode_of_pooja}</p>
    <p><strong>Additional Devotees:</strong> ${number_of_devotees}</p>
    <p><strong>Tax:</strong> ₹${tax}</p>
    <p><strong>Service Charge:</strong> ₹${service_charge}</p>
    <p><strong>Total Amount Paid:</strong> ₹${total_price}</p>

    <br />
    <br />
    <p>If you have any questions, feel free to contact our support team.</p>
    <br />
    <p>Thank you,</p>
    <p>The Soul Harmony Team</p>
  </body>
</html>

    `,
  };
  try {
    await transporter.sendMail(mail);
  } catch (e) {
    throw new Error("Could not send email");
  }
};

export const sendEmailVerificationEmail = async (email, token) => {
  const emailVerificationLink = `${envConfig.BASE_URL}/api/auth/verify-email?token=${token}`;
  const emailContent = {
    from: envConfig.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
  <!DOCTYPE html>
  <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
    </head>
  <body style="font-family: Arial, sans-serif;">
    <div
    >
      <p>Hi there,</p>
      <p>Thank you for registering with us!</p>
      <p>Please verify your email address by clicking the below link:</p>

      <a
        href="${emailVerificationLink}"
        target="_blank"
        >Verify Email</a
      >
      <p>
        If you did not sign up for this account, please ignore this email.
      </p>
      <br/>
      <br/>
      <p>Best regards,</p>
      <p>The Soul Harmony Pooja Team</p>
    </div>
  </body>
</html>
    `,
  };
  try {
    await transporter.sendMail(emailContent);
  } catch (e) {
    console.error(e);
    throw new Error("Could not send email");
  }
};

export const sendPriestAcceptedEmail = async (email, orderId, poojaName, priestName, poojaDate, poojaTime) => {
  const emailContent = {
    from: envConfig.EMAIL_USER,
    to: email,
    subject: "Booking Confirmed: Priest Assigned for your Pooja",
    html: `
  <!DOCTYPE html>
  <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Priest Assigned</title>
    </head>
  <body style="font-family: Arial, sans-serif;">
    <div>
      <p>Namaste,</p>
      <p>We are pleased to inform you that <b>${priestName}</b> has accepted your request for the <b>${poojaName}</b> (Booking ID: ${orderId}).</p>
      <p>Your pooja is scheduled for <b>${poojaDate}</b> at <b>${poojaTime}</b>.</p>
      <p>Your booking is now fully confirmed.</p>
      <br/>
      <br/>
      <p>Best regards,</p>
      <p>The Soul Harmony Pooja Team</p>
    </div>
  </body>
</html>
    `,
  };
  try {
    await transporter.sendMail(emailContent);
  } catch (e) {
    console.error(e);
  }
};

export const sendPriestCancelledEmail = async (email, orderId, poojaName, reason) => {
  const rebookLink = `${envConfig.FRONTEND_DEVOTEE_URL}/book-pooja`;
  const emailContent = {
    from: envConfig.EMAIL_USER,
    to: email,
    subject: "Action Required: Priest Cancelled your Pooja Request",
    html: `
  <!DOCTYPE html>
  <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Priest Cancelled</title>
    </head>
  <body style="font-family: Arial, sans-serif;">
    <div>
      <p>Namaste,</p>
      <p>We regret to inform you that your selected priest was unable to accept your request for the <b>${poojaName}</b> pooja (Booking ID: ${orderId}).</p>
      <p><b>Reason provided:</b> ${reason || 'No reason provided.'}</p>
      <p>Please click the link below to select an alternative priest for your pooja.</p>
      <a
        href="${rebookLink}"
        target="_blank"
        >Select Another Priest</a
      >
      <br/>
      <br/>
      <p>Best regards,</p>
      <p>The Soul Harmony Pooja Team</p>
    </div>
  </body>
</html>
    `,
  };
  try {
    await transporter.sendMail(emailContent);
  } catch (e) {
    console.error(e);
  }
};

export const sendPriestNewRequestEmail = async (email, orderId, poojaName, devoteeName, poojaDate, poojaTime) => {
  const loginLink = `${envConfig.FRONTEND_PRIEST_URL}/login`;
  const emailContent = {
    from: envConfig.EMAIL_USER,
    to: email,
    subject: "New Pooja Request Assigned to You",
    html: `
  <!DOCTYPE html>
  <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Pooja Request</title>
    </head>
  <body style="font-family: Arial, sans-serif;">
    <div>
      <p>Namaste,</p>
      <p>A new pooja request has been assigned to you. A devotee is requesting your service.</p>
      <p><b>Pooja Name:</b> ${poojaName}</p>
      <p><b>Devotee Name:</b> ${devoteeName}</p>
      <p><b>Date:</b> ${poojaDate}</p>
      <p><b>Time:</b> ${poojaTime}</p>
      <p>Please log in to your dashboard to review and either Accept or Decline this request.</p>
      <br/>
      <a
        href="${loginLink}"
        target="_blank"
        >Go to Dashboard</a
      >
      <br/>
      <br/>
      <p>Best regards,</p>
      <p>The Soul Harmony Team</p>
    </div>
  </body>
</html>
    `,
  };
  try {
    await transporter.sendMail(emailContent);
  } catch (e) {
    console.error("Error sending new priest request email: ", e);
  }
};

export const sendRefundRequestAdminEmail = async (orderId, poojaName, devoteeName, devoteeEmail) => {
  const emailContent = {
    from: envConfig.EMAIL_USER,
    to: 'admin@ritualsbysh.com',
    subject: `Refund Request: Order ID ${orderId}`,
    html: `
  <!DOCTYPE html>
  <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Request</title>
    </head>
  <body style="font-family: Arial, sans-serif;">
    <div>
      <p>Hello Admin,</p>
      <p>A devotee has requested a refund for a cancelled pooja booking.</p>
      <p><b>Order ID:</b> ${orderId}</p>
      <p><b>Pooja Name:</b> ${poojaName}</p>
      <p><b>Devotee Name:</b> ${devoteeName}</p>
      <p><b>Devotee Email:</b> ${devoteeEmail}</p>
      <br/>
      <p>Please review this request and process the refund accordingly.</p>
      <br/>
      <p>Best regards,</p>
      <p>The Soul Harmony System</p>
    </div>
  </body>
</html>
    `,
  };
  try {
    await transporter.sendMail(emailContent);
  } catch (e) {
    console.error("Error sending refund request admin email: ", e);
  }
};
