import pool from '../../config/db.config.js';
import { BadRequestError } from '../../utils/errors.utils.js';

export const getFinanceDashboardDataModel = async (religionId, period) => {
  //! Base query for earnings
  let earningsBaseQuery = `
    SELECT
        IFNULL(SUM(pb.total_price), 0.0) AS total_sales,
        IFNULL(SUM(pb.tax), 0.0) AS total_tax,
        IFNULL(SUM(pb.service_charge), 0.0) AS total_service_charge,
        IFNULL((SUM(pb.total_price ) - SUM(pb.tax) - SUM(pe.earning_amount)), 0.0) AS net_profit
    FROM pooja_bookings pb
    LEFT JOIN priests_earnings pe ON pb.id = pe.booking_id
    WHERE 
        pb.payment_status = 'completed' AND 
        pb.status = 'completed' AND 
        pb.priest_order_status = 'completed' AND
        (pb.user_order_status = 'completed' OR pb.user_order_status = 'auto-completed')
    `;

  //! Base query for donations
  let donationsBaseQuery = `
    SELECT
        IFNULL(SUM(ud.amount), 0.0) AS total_donations
    FROM user_donations ud
    WHERE 
        ud.payment_status = 'completed'
  `;

  //! Base query for user offerings
  let offeringsBaseQuery = `
    SELECT
        IFNULL(SUM(uo.amount), 0.0) AS total_offerings
    FROM user_offerings uo
    WHERE 
        uo.payment_status = 'completed'
  `;

  const earningsQueryParams = [];
  const donationsQueryParams = [];
  const offeringsQueryParams = [];

  if (religionId) {
    earningsBaseQuery += ` AND pb.religion_id = ? `;
    earningsQueryParams.push(religionId);

    donationsBaseQuery += ` AND ud.religion_id = ? `;
    donationsQueryParams.push(religionId);

    offeringsBaseQuery += ` AND uo.religion_id = ? `;
    offeringsQueryParams.push(religionId);
  }

  if (period) {
    const periodLower = period.toLowerCase();
    if (periodLower === "today") {
      earningsBaseQuery += ` AND DATE(pb.completed_at) = CURDATE() `;
      donationsBaseQuery += ` AND DATE(ud.donation_date) = CURDATE() `;
      offeringsBaseQuery += ` AND DATE(uo.offer_submitted_date) = CURDATE() `;
    } else if (periodLower === "month") {
      earningsBaseQuery += ` AND MONTH(pb.completed_at) = MONTH(CURDATE()) AND YEAR(pb.completed_at) = YEAR(CURDATE()) `;
      donationsBaseQuery += ` AND MONTH(ud.donation_date) = MONTH(CURDATE()) AND YEAR(ud.donation_date) = YEAR(CURDATE()) `;
      offeringsBaseQuery += ` AND MONTH(uo.offer_submitted_date) = MONTH(CURDATE()) AND YEAR(uo.offer_submitted_date) = YEAR(CURDATE()) `;
    } else if (periodLower === "year") {
      earningsBaseQuery += ` AND YEAR(pb.completed_at) = YEAR(CURDATE()) `;
      donationsBaseQuery += ` AND YEAR(ud.donation_date) = YEAR(CURDATE()) `;
      offeringsBaseQuery += ` AND YEAR(uo.offer_submitted_date) = YEAR(CURDATE()) `;
    }
  }

  const [row] = await pool.execute(earningsBaseQuery, earningsQueryParams);
  const [donationsRow] = await pool.execute(
    donationsBaseQuery,
    donationsQueryParams
  );
  const [offeringsRow] = await pool.execute(
    offeringsBaseQuery,
    offeringsQueryParams
  );

  return {
    earnings_details: row[0],
    donations_details: donationsRow[0],
    offerings_details: offeringsRow[0],
  };
};

export const getUsersSalesDataModel = async (
  religionId,
  period,
  page_number,
  page_size
) => {
  const offset = (page_number - 1) * page_size;

  let salesBaseQuery = `
    SELECT
        pb.id,
        u.user_name,
        pb.completed_at,
        r.religion_name,
        (pb.total_price) AS earning_amount
    FROM pooja_bookings pb
    LEFT JOIN users u ON pb.user_id = u.id
    LEFT JOIN priests_earnings pe ON pb.id = pe.booking_id
    LEFT JOIN religions r ON pb.religion_id = r.id
    WHERE 
        pb.payment_status = 'completed' AND 
        pb.status = 'completed' AND 
        pb.priest_order_status = 'completed' AND
        (pb.user_order_status = 'completed' OR pb.user_order_status = 'auto-completed')
    `;

  const salesQueryParams = [];
  if (religionId) {
    salesBaseQuery += ` AND pb.religion_id = ? `;
    salesQueryParams.push(religionId);
  }

  if (period) {
    const periodLower = period.toLowerCase();
    if (periodLower === "today") {
      salesBaseQuery += ` AND DATE(pb.completed_at) = CURDATE() `;
    } else if (periodLower === "month") {
      salesBaseQuery += ` AND MONTH(pb.completed_at) = MONTH(CURDATE()) AND YEAR(pb.completed_at) = YEAR(CURDATE()) `;
    } else if (periodLower === "year") {
      salesBaseQuery += ` AND YEAR(pb.completed_at) = YEAR(CURDATE()) `;
    }
  }

  const [totalRecordsRow] = await pool.execute(
    salesBaseQuery,
    salesQueryParams
  );

  salesBaseQuery += ` ORDER BY pb.completed_at DESC LIMIT ? OFFSET ?`;
  salesQueryParams.push(page_size.toString(), offset.toString());

  const [rows] = await pool.execute(salesBaseQuery, salesQueryParams);
  return {
    pagination: {
      page_number,
      page_size,
      count: rows.length,
      total_pages: Math.ceil(totalRecordsRow.length / page_size),
      total_records: totalRecordsRow.length,
      next_page: offset + page_size < totalRecordsRow.length,
      previous_page: offset > 0,
    },
    earnings_data: rows,
  };
};

export const getPriestPaymentSummeryDetailsModel = async (
  religionId,
  period
) => {
  //! Payment Summary Query
  let paymentSummaryBaseQuery = `
    SELECT
        IFNULL(SUM(pb.total_price), 0.0) AS total_earnings
    FROM pooja_bookings pb
    WHERE 
        pb.payment_status = 'completed' AND 
        pb.status = 'completed' AND 
        pb.priest_order_status = 'completed' AND
        (pb.user_order_status = 'completed' OR pb.user_order_status = 'auto-completed')    
  `;

  //! Priest Payment Query
  let priestPaymentQuery = `
    SELECT
        IFNULL(SUM(pe.earning_amount), 0.0) AS total_priest_paid_amount
    FROM priests_earnings pe
    LEFT JOIN pooja_bookings pb ON pe.booking_id = pb.id
    WHERE 
        pe.is_paid_to_priest = TRUE AND
        pe.paid_status = 'completed'
  `;

  const paymentSummaryQueryParams = [];
  const priestPaymentQueryParams = [];
  if (religionId) {
    paymentSummaryBaseQuery += ` AND pb.religion_id = ? `;
    paymentSummaryQueryParams.push(religionId);

    priestPaymentQuery += ` AND pb.religion_id = ? `;
    priestPaymentQueryParams.push(religionId);
  }

  if (period) {
    const periodLower = period.toLowerCase();
    if (periodLower === "today") {
      paymentSummaryBaseQuery += ` AND DATE(pb.completed_at) = CURDATE() `;
      priestPaymentQuery += ` AND DATE(pe.payment_date) = CURDATE() `;
    } else if (periodLower === "month") {
      paymentSummaryBaseQuery += ` AND MONTH(pb.completed_at) = MONTH(CURDATE()) AND YEAR(pb.completed_at) = YEAR(CURDATE()) `;
      priestPaymentQuery += ` AND MONTH(pe.payment_date) = MONTH(CURDATE()) AND YEAR(pe.payment_date) = YEAR(CURDATE()) `;
    } else if (periodLower === "year") {
      paymentSummaryBaseQuery += ` AND YEAR(pb.completed_at) = YEAR(CURDATE()) `;
      priestPaymentQuery += ` AND YEAR(pe.payment_date) = YEAR(CURDATE()) `;
    }
  }

  const [row] = await pool.execute(
    paymentSummaryBaseQuery,
    paymentSummaryQueryParams
  );

  const [priestPaymentRow] = await pool.execute(
    priestPaymentQuery,
    priestPaymentQueryParams
  );

  return {
    period: period || "all",
    religion_id: religionId || null,
    earnings: row[0],
    priest_payments: priestPaymentRow[0],
  };
};

export const getPriestPaymentStatusDetailsListModel = async (
  religionId,
  period,
  page_number,
  page_size
) => {
  const offset = (page_number - 1) * page_size;

  let paymentStatusBaseQuery = `
    SELECT
        u.user_name AS priest_name,
        pe.*
    FROM priests_earnings pe
    LEFT JOIN users u ON pe.priest_id = u.id
    LEFT JOIN priests p ON pe.priest_id = p.user_id 
    WHERE 1=1
  `;

  const paymentStatusQueryParams = [];
  if (religionId) {
    paymentStatusBaseQuery += ` AND p.religion_id = ? `;
    paymentStatusQueryParams.push(religionId);
  }

  if (period) {
    const periodLower = period.toLowerCase();
    if (periodLower === "today") {
      paymentStatusBaseQuery += ` AND DATE(pe.created_at) = CURDATE() `;
    } else if (periodLower === "month") {
      paymentStatusBaseQuery += ` AND MONTH(pe.created_at) = MONTH(CURDATE()) AND YEAR(pe.created_at) = YEAR(CURDATE()) `;
    } else if (periodLower === "year") {
      paymentStatusBaseQuery += ` AND YEAR(pe.created_at) = YEAR(CURDATE()) `;
    }
  }

  const [rows] = await pool.execute(
    paymentStatusBaseQuery,
    paymentStatusQueryParams
  );
  const totalRecords = rows.length;

  return {
    pagination: {
      page_number,
      page_size,
      count: rows.length,
      total_pages: Math.ceil(totalRecords / page_size),
      total_records: totalRecords,
      next_page: offset + page_size < totalRecords,
      previous_page: offset > 0,
    },
    payment_data: rows,
  };
};

export const updatePriestEarningPaymentStatusModel = async (
  orderId,
  details
) => {
  const {
    paid_status,
    payment_method = null,
    payment_reference = null,
    remarks = null,
  } = details;

  let query = `
    UPDATE priests_earnings
    SET
      paid_status = ?,
      payment_method = ?,
      payment_reference = ?,
      remarks = ?
    
  `;

  const params = [
    paid_status,
    payment_method,
    payment_reference,
    remarks,
    orderId,
  ];

  if (paid_status === "completed") {
    query += `, is_paid_to_priest = TRUE, payment_date = NOW() `;
  }

  query += ` WHERE order_id = ?`;

  const existQuery = `SELECT id FROM priests_earnings WHERE order_id = ?`;
  const [existRows] = await pool.execute(existQuery, [orderId]);
  if (existRows.length === 0) {
    throw new BadRequestError("Invalid order ID");
  }

  const [result] = await pool.execute(query, params);
  return result.affectedRows > 0;
};
