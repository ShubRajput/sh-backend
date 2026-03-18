CREATE TABLE IF NOT EXISTS temple_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ritual_modes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ritual_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default data
INSERT INTO temple_types (name, multiplier) VALUES
  ('Jyotirlinga', 1.75),
  ('City or Shakti Peeth', 1.50),
  ('Tier 2', 1.25),
  ('Tier 3', 1.15);

INSERT INTO ritual_modes (name, multiplier) VALUES
  ('Live Video', 1.75),
  ('Pre-Recorded', 1.50),
  ('In-Person', 1.25),
  ('On-Site', 1.15);

INSERT INTO ritual_groups (name, display_name, multiplier) VALUES
  ('Individual', 'Soul', 1.25),
  ('Couple', 'Together', 1.50),
  ('Family', 'Family', 1.75),
  ('Corporate', 'Harmony', 5.00);
