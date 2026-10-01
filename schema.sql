-- ========================================================
-- DATABASE SCHEMA: sewatech (MySQL)
-- Platform Rental Laptop, Drone & Kamera Profesional
-- ========================================================

CREATE DATABASE IF NOT EXISTS `sewatech` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sewatech`;

-- --------------------------------------------------------
-- 1. Tabel Customer (Penyewa Terdaftar & Verifikasi KTP)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `phone` VARCHAR(25) NOT NULL,
  `nik` CHAR(16) NOT NULL UNIQUE,
  `address` TEXT NOT NULL,
  `emergency_name` VARCHAR(120) DEFAULT NULL,
  `emergency_relation` VARCHAR(50) DEFAULT 'Orang Tua',
  `emergency_phone` VARCHAR(25) DEFAULT NULL,
  `ktp_photo_url` TEXT DEFAULT NULL,
  `ktp_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `rejection_reason` TEXT DEFAULT NULL,
  `rentals_completed` INT UNSIGNED NOT NULL DEFAULT 0,
  `trust_score` DECIMAL(3, 1) NOT NULL DEFAULT 4.0,
  `registered_at` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 2. Tabel Produk / Armada Rental (Laptop Windows & MacBook)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('laptop-windows', 'laptop-mac') NOT NULL,
  `sub_category` VARCHAR(100) DEFAULT NULL,
  `headline` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `daily_rate` INT UNSIGNED NOT NULL,
  `deposit_amount` INT UNSIGNED NOT NULL,
  `stock` INT UNSIGNED NOT NULL DEFAULT 1,
  `available_stock` INT UNSIGNED NOT NULL DEFAULT 1,
  `image_url` TEXT NOT NULL,
  `unit_condition` ENUM('Mulus 99%', 'Like New', 'Grade A') NOT NULL DEFAULT 'Like New',
  `rating` DECIMAL(2, 1) NOT NULL DEFAULT 4.9,
  `reviews_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Tabel Pesanan & Pembayaran QRIS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rental_orders` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `order_number` VARCHAR(35) NOT NULL UNIQUE,
  `customer_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `rental_duration_days` INT UNSIGNED NOT NULL DEFAULT 1,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `daily_rate` INT UNSIGNED NOT NULL,
  `rental_fee_total` INT UNSIGNED NOT NULL,
  `deposit_amount` INT UNSIGNED NOT NULL,
  `total_amount` INT UNSIGNED NOT NULL,
  `delivery_method` ENUM('delivery', 'pickup') NOT NULL DEFAULT 'delivery',
  `delivery_address` TEXT NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `payment_method` VARCHAR(20) NOT NULL DEFAULT 'QRIS',
  `payment_status` ENUM('pending', 'proof_submitted', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `payment_proof_url` TEXT DEFAULT NULL,
  `proof_submitted_at` DATETIME DEFAULT NULL,
  `status` ENUM(
    'awaiting_payment',
    'validating_proof',
    'in_delivery_or_ready',
    'received_in_use',
    'completed',
    'disputed'
  ) NOT NULL DEFAULT 'awaiting_payment',
  `return_due_date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_order_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 4. Tabel Pusat Penyelesaian Masalah (Dispute & Incident Center)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `platform_issues` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `case_number` VARCHAR(35) NOT NULL UNIQUE,
  `order_id` VARCHAR(50) NOT NULL,
  `customer_id` VARCHAR(50) NOT NULL,
  `issue_type` ENUM(
    'barang_hilang',
    'belum_kembali',
    'barang_rusak',
    'terlambat',
    'penipuan_ktp'
  ) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `fine_amount` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('open', 'contacted_wa', 'investigating', 'resolved', 'legal_action') NOT NULL DEFAULT 'open',
  `reported_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_issue_order` FOREIGN KEY (`order_id`) REFERENCES `rental_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_issue_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
