CREATE DATABASE IF NOT EXISTS soul_harmony_pooja_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE soul_harmony_pooja_db;

-- Table structure for table `users`
CREATE TABLE IF NOT EXISTS users (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  date_of_birth DATE,
  maritial_state ENUM('single', 'married', 'divorced', 'widowed'),
  nationality VARCHAR(50),
  gotra VARCHAR(50),
  location VARCHAR(100),
  phone_number VARCHAR(15),
  temple_location VARCHAR(50),
  is_email_verified BOOLEAN DEFAULT FALSE,
  profile_image_url VARCHAR(255),
  reset_password_token VARCHAR(255),
  is_suspended BOOLEAN DEFAULT FALSE,
  is_deactivated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for table `religions`
CREATE TABLE IF NOT EXISTS religions (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  religion_key VARCHAR(255) NOT NULL UNIQUE,
  religion_name VARCHAR(255) NOT NULL,
  religion_description TEXT,
  hover_description TEXT,
  sanctuary_name VARCHAR(255),
  feature_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for table `religions_images`
CREATE TABLE IF NOT EXISTS religions_images (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  religion_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_type ENUM('hover','description') NOT NULL,
  s3_image_key VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table  `user_devotees`
CREATE TABLE IF NOT EXISTS user_devotees (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  devotee_name VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  gotra VARCHAR(50),
  gender ENUM('M','F') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );


-- Table structure for table `pooja`
CREATE TABLE IF NOT EXISTS pooja (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  pooja_key VARCHAR(50) NOT NULL UNIQUE,
  pooja_name VARCHAR(100) NOT NULL,
  pooja_description TEXT,
  duration_in_hours DECIMAL(5, 1) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  image_url VARCHAR(255),
  s3_image_key VARCHAR(255),
  religion_id INT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table `temples`
CREATE TABLE IF NOT EXISTS temples (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  temple_key VARCHAR(50) NOT NULL UNIQUE,
  temple_name VARCHAR(100) NOT NULL,
  temple_description TEXT,
  location VARCHAR(100),
  image_url VARCHAR(255),
  s3_image_key VARCHAR(255),
  tagline VARCHAR(255),
  religion_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table `souvernirs
CREATE TABLE IF NOT EXISTS souvernirs (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  souv_key VARCHAR(50) NOT NULL UNIQUE,
  souv_name VARCHAR(100) NOT NULL,
  souv_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  image_url VARCHAR(255),
  s3_image_key VARCHAR(255),
  religion_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table `priests`
CREATE TABLE IF NOT EXISTS priests (
  user_id INT PRIMARY KEY,
  priest_location VARCHAR(100),
  religion VARCHAR(50) NOT NULL,
  religion_id INT NOT NULL,
  introduction VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table `pooja_bookings`
CREATE TABLE IF NOT EXISTS pooja_bookings (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pooja_id INT NOT NULL,
  temple_id INT NOT NULL,
  priest_id INT DEFAULT NULL,
  religion_id INT,
  mode_of_pooja ENUM('live','recorded','on_site') NOT NULL,
  live_or_recorded_url VARCHAR(255),
  pooja_name VARCHAR(100) NOT NULL,
  pooja_location VARCHAR(100) NOT NULL,
  pooja_date DATE,
  pooja_time TIME,
  duration_in_hours DECIMAL(5, 1),
  gotra VARCHAR(50),
  status ENUM('pending', 'active', 'cancelled', 'completed') DEFAULT 'pending',
  priest_order_status ENUM('pending', 'active', 'cancelled', 'completed') DEFAULT 'pending',
  user_order_status ENUM('auto-completed', 'active', 'cancelled', 'completed') DEFAULT 'active',
  additional_note TEXT,
  number_of_devotees INT DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  total_price DECIMAL(10, 2) NOT NULL,
  service_charge DECIMAL(10, 2) DEFAULT 0.00,
  discount_amount DECIMAL(10, 2) DEFAULT 0.00,
  payment_id VARCHAR(255),
  order_id VARCHAR(255),
  payment_receipt_id VARCHAR(255),
  signature VARCHAR(255),
  completed_at TIMESTAMP,
  payment_status ENUM('pending', 'completed', 'failed','authorized','refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (priest_id) REFERENCES priests(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pooja_id) REFERENCES pooja(id) ON DELETE CASCADE,
  FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE SET NULL
);


-- Table structure for table `pooja_booking_souvernirs`
CREATE TABLE IF NOT EXISTS pooja_booking_souvernirs (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  souv_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES pooja_bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (souv_id) REFERENCES souvernirs(id) ON DELETE CASCADE
);

-- Table structure for table `user_billing_address`
CREATE TABLE IF NOT EXISTS user_billing_address (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone_number VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table structure for table `user_preferred_temples`
CREATE TABLE IF NOT EXISTS user_preferred_temples (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  temple_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
);

-- Table structure for table `user_favourite_poojas`
CREATE TABLE IF NOT EXISTS user_favourite_poojas (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pooja_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pooja_id) REFERENCES pooja(id) ON DELETE CASCADE
);

-- Table structure for table `user_favourite_temples`
CREATE TABLE IF NOT EXISTS user_favourite_temples (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  temple_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
);

-- Table structure for table `rating`
CREATE TABLE IF NOT EXISTS rating (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  pooja_booking_id INT NOT NULL,
  review TEXT,
  comment TEXT,
  user_id INT NOT NULL,
  priest_id INT NOT NULL,
  rate INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pooja_booking_id) REFERENCES pooja_bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (priest_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table structure for table `offerings`
CREATE TABLE IF NOT EXISTS offerings (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  offering_key VARCHAR(255) NOT NULL UNIQUE,
  offering_name VARCHAR(100) NOT NULL, 
  offering_description TEXT, 
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  religion_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table `offerings_images`
CREATE TABLE IF NOT EXISTS offerings_images (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  offering_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  image_type ENUM('profile_offering','description_offering') NOT NULL,
  s3_image_key VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (offering_id) REFERENCES offerings(id) ON DELETE CASCADE
);

-- Table structure for table `roles`
CREATE TABLE IF NOT EXISTS roles (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  role_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for table `user_roles`
CREATE TABLE IF NOT EXISTS user_roles (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Table structure for table `priests_earnings`
CREATE TABLE IF NOT EXISTS priests_earnings (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL,
  booking_id INT NOT NULL,
  priest_id INT NOT NULL,
  earning_amount DECIMAL(10, 2) DEFAULT 0.00,
  bonus_coin DECIMAL(10, 2) DEFAULT 0.00,
  is_paid_to_priest BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMP,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  paid_status ENUM('pending', 'in-progress', 'completed', 'failed','holding') DEFAULT 'pending',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES pooja_bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (priest_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table structure for table `payment_details`
CREATE TABLE IF NOT EXISTS payment_details (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  priest_id INT NOT NULL,
  account_holder_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  branch_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (priest_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Table structure for table `system_users`
CREATE TABLE IF NOT EXISTS system_users (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for table `system_user_roles`
CREATE TABLE IF NOT EXISTS system_user_roles (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES system_users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Table structure for table `how_we_pray`
CREATE TABLE IF NOT EXISTS how_we_pray(
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    header_text VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    s3_image_key VARCHAR(255) NOT NULL,
    religion_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table `user_donations`
CREATE TABLE IF NOT EXISTS user_donations (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    payment_id VARCHAR(255),
    order_id VARCHAR(255),
    signature VARCHAR(255),
    payment_receipt_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    religion_id INT,
    payment_status ENUM('pending', 'completed', 'failed','authorized','refunded') DEFAULT 'pending',
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE SET NULL
);

-- Table structure for table `donations`
CREATE TABLE IF NOT EXISTS donations (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  donation_key VARCHAR(50) NOT NULL UNIQUE,
  donation_name VARCHAR(100) NOT NULL,
  donation_description TEXT,
  image_url VARCHAR(255),
  s3_image_key VARCHAR(255),
  religion_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE CASCADE
);

-- Table structure for table `user_offerings`
CREATE TABLE IF NOT EXISTS user_offerings (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    temple_id INT,
    payment_id VARCHAR(255),
    order_id VARCHAR(255),
    signature VARCHAR(255),
    payment_receipt_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    religion_id INT,
    payment_status ENUM('pending', 'completed', 'failed','authorized','refunded') DEFAULT 'pending',
    offer_submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (religion_id) REFERENCES religions(id) ON DELETE SET NULL,
    FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE SET NULL
);

-- Table structure for table `user_offerings_items`
CREATE TABLE IF NOT EXISTS user_offerings_items (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_offering_id INT NOT NULL,
  offering_id INT,
  item_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_offering_id) REFERENCES user_offerings(id) ON DELETE CASCADE,
  FOREIGN KEY (offering_id) REFERENCES offerings(id) ON DELETE SET NULL
);

-- Table structure for table `banks`
CREATE TABLE IF NOT EXISTS banks (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  bank_name VARCHAR(100) NOT NULL,
  bank_code VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table structure for table `priest_ignored_pooja_bookings`
CREATE TABLE IF NOT EXISTS priest_ignored_pooja_bookings (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  priest_id INT NOT NULL,
  pooja_booking_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (priest_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pooja_booking_id) REFERENCES pooja_bookings(id) ON DELETE CASCADE
);

-- Table structure for table `admin_reset_password`
CREATE TABLE IF NOT EXISTS admin_reset_password (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  otp VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table structure for table `users_refresh_tokens`
CREATE TABLE IF NOT EXISTS users_refresh_tokens (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table structure for table `system_users_refresh_tokens`
CREATE TABLE IF NOT EXISTS system_users_refresh_tokens (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  system_user_id INT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (system_user_id) REFERENCES system_users(id) ON DELETE CASCADE
);

-- Table structure for table `user_email_verification_tokens`
CREATE TABLE IF NOT EXISTS user_email_verification_tokens (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default roles if they do not exist
INSERT INTO roles (name, role_description) VALUES
  ('admin', 'Administrator with full access'),
  ('user', 'Regular user with limited access'),
  ('priest', 'Priest with access to manage poojas and bookings'),
  ('volunteer', 'Volunteer with access to assist in temple activities')
  
ON DUPLICATE KEY UPDATE
  role_description = VALUES(role_description);

-- Table structure for table `priest_availability`
CREATE TABLE IF NOT EXISTS priest_availability (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  priest_id INT NOT NULL,
  temple_id INT unsigned NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (priest_id) REFERENCES priests(user_id) ON DELETE CASCADE,
  FOREIGN KEY (temple_id) REFERENCES temples(id) ON DELETE CASCADE
);

-- Table structure for table `priest_unavailability`
CREATE TABLE IF NOT EXISTS priest_unavailability (
  id INT unsigned AUTO_INCREMENT PRIMARY KEY,
  priest_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (priest_id) REFERENCES priests(user_id) ON DELETE CASCADE
);

-- Alter table pooja_bookings to add cancel_reason
ALTER TABLE pooja_bookings
ADD COLUMN IF NOT EXISTS cancel_reason TEXT AFTER priest_order_status;