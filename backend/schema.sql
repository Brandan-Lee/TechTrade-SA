-- =============================================================================
-- TechTrade SA — MySQL 8.0.16+ source schema
-- Peer-to-peer PC hardware marketplace (South Africa)
--
-- Data model: relational SQL. Atomic attributes and child/bridge rows avoid
-- repeating groups (1NF); composite-key bridge rows have no partial dependencies
-- (2NF); transactional entities target 3NF/BCNF. roles is a lookup; fixed value
-- domains use constrained ENUM columns.
-- Physical storage: InnoDB row storage on disk, redo/undo logging, and B-tree
-- indexes. Runtime: client-server, currently used by the PHP application.
-- Foreign keys RESTRICT deletes/updates by default; cascades/nullification are explicit.
--
-- Intentional display snapshots/caches are documented at their columns. Update
-- trust_score/trade_count with review/completed-trade writes, strike_count with
-- user_strikes writes, view_count with a new listing_views row, and hardware.full_name
-- with brand/model changes in the same transaction; periodically reconcile each
-- cache. Keep tables unpartitioned until measured scale/retention needs justify the
-- added operational complexity.
--
-- B-tree indexes cover common user lookups, FK joins, marketplace status/category/
-- price/sort filters, buyer offer history, transaction queues, and unread/expiry
-- queues. Composite index order follows the leading equality filters, then range or
-- sort columns; validate against production EXPLAIN plans before adding more indexes.
--
-- This file is executable MySQL DDL for the current phpMyAdmin/PHP runtime. The
-- PostgreSQL plan below is advisory; do not execute this file on PostgreSQL.
-- =============================================================================
SET
  NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS techtrade_za CHARACTER
SET
  utf8mb4 COLLATE utf8mb4_unicode_ci;

USE techtrade_za;

-- -----------------------------------------------------------------------------
-- 1. USERS & AUTH
-- -----------------------------------------------------------------------------
CREATE TABLE
  roles (
    id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(64) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_code (code)
  ) ENGINE = InnoDB;

-- Stable IDs consumed by the application: 1=User, 3=Moderator, 4=Admin.
-- reg_type below describes marketplace participation, not authorization.
INSERT INTO roles (id, code, name)
VALUES
  (1, 'user', 'User'),
  (3, 'moderator', 'Moderator'),
  (4, 'admin', 'Admin');

CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(100) NULL,
    hardware_id VARCHAR(255) NULL, -- External device identifier; not catalog hardware_id
    province VARCHAR(64) NULL,
    avatar_url VARCHAR(512) NULL,
    reg_type ENUM ('buyer', 'seller', 'both') NOT NULL DEFAULT 'buyer',
    member_since DATE NOT NULL DEFAULT (CURRENT_DATE), -- Effective membership date; may predate import
    trust_score DECIMAL(3, 2) NOT NULL DEFAULT 0.00, -- Cache derived from received reviews
    trade_count INT UNSIGNED NOT NULL DEFAULT 0, -- Cache derived from completed transactions
    strike_count TINYINT UNSIGNED NOT NULL DEFAULT 0, -- Cache derived from user_strikes
    is_suspended TINYINT (1) NOT NULL DEFAULT 0,
    has_been_suspended TINYINT (1) NOT NULL DEFAULT 0,
    suspended_at DATETIME NULL,
    suspended_reason TEXT NULL,
    suspended_until DATETIME NULL,
    is_banned TINYINT (1) NOT NULL DEFAULT 0,
    banned_at DATETIME NULL,
    ban_reason TEXT NULL,
    tos_accepted_at DATETIME NULL,
    last_login_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT (1) NOT NULL DEFAULT 0,
    MFA TINYINT (1) NOT NULL DEFAULT 1, -- Legacy column name; boolean MFA-enabled flag
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY index_users_role (role_id),
    KEY index_users_province (province),
    CONSTRAINT chk_users_trust_score CHECK (trust_score BETWEEN 0 AND 5),
    CONSTRAINT chk_users_boolean_flags CHECK (
      is_suspended IN (0, 1)
      AND has_been_suspended IN (0, 1)
      AND is_banned IN (0, 1)
      AND is_deleted IN (0, 1)
      AND MFA IN (0, 1)
    ),
    CONSTRAINT chk_users_suspension_interval CHECK (
      suspended_at IS NULL
      OR suspended_until IS NULL
      OR suspended_until >= suspended_at
    ),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE user_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    selector VARCHAR(64) NOT NULL,
    hashed_validator VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    UNIQUE KEY uq_user_tokens_selector (selector),
    KEY idx_user_tokens_expiry (expires_at),
    CONSTRAINT fk_user_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE
  otp_verifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    email VARCHAR(255) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    purpose ENUM('login', 'reset', 'admin') NOT NULL,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_otp_email_expiry (email, expires_at),
    CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 2. HARDWARE CATALOG (admin “Tech Database”)
--    Parent: hardware — one row per component in the master registry
--    Child:  type-specific spec table (1:1 via hardware_id PK)
-- -----------------------------------------------------------------------------
CREATE TABLE
  categories (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    group_label VARCHAR(32) NOT NULL,
    name VARCHAR(64) NOT NULL, 
    slug VARCHAR(64) NOT NULL, 
    spec_table VARCHAR(32) NULL, 
    sort_order SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_slug (slug)
  ) ENGINE = InnoDB;

-- Master registry: every catalog component lives here first.
-- full_name is a maintained display cache of brand + model; update it in the same
-- write transaction as either source attribute and periodically reconcile it.
CREATE TABLE
  hardware (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id SMALLINT UNSIGNED NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    full_name VARCHAR(255) NOT NULL, -- e.g. "NVIDIA GeForce RTX 3080 Ti FE"
    slug VARCHAR(255) NOT NULL, -- url-safe unique key
    msrp_cents INT UNSIGNED NULL, -- reference MSRP in ZAR cents
    is_active TINYINT (1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_hardware_slug (slug),
    KEY idx_hardware_category (category_id),
    KEY idx_hardware_brand_model (brand, model),
    FULLTEXT KEY ft_hardware_search (brand, model, full_name),
    CONSTRAINT chk_hardware_is_active CHECK (is_active IN (0, 1)),
    CONSTRAINT fk_hardware_category FOREIGN KEY (category_id) REFERENCES categories (id)
  ) ENGINE = InnoDB;

-- GPUs (category slug: gpus)
CREATE TABLE
  gpus (
    hardware_id BIGINT UNSIGNED NOT NULL,
    chipset VARCHAR(100) NULL, -- e.g. GA102, AD102
    vram_gb DECIMAL(5, 1) NULL,
    vram_type VARCHAR(32) NULL, -- GDDR6X, GDDR6
    core_clock_mhz INT UNSIGNED NULL,
    boost_clock_mhz INT UNSIGNED NULL,
    pcie_version VARCHAR(32) NULL, -- PCIe 4.0 x16
    tdp_watts SMALLINT UNSIGNED NULL,
    length_mm SMALLINT UNSIGNED NULL,
    slot_width TINYINT UNSIGNED NULL, -- physical slots occupied
    PRIMARY KEY (hardware_id),
    CONSTRAINT fk_gpus_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

CREATE TABLE gpu_power_connectors (
    hardware_id BIGINT UNSIGNED NOT NULL,
    connector_type VARCHAR(32) NOT NULL,
    quantity TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (hardware_id, connector_type),
    CONSTRAINT chk_gpu_power_connector_quantity CHECK (quantity > 0),
    CONSTRAINT fk_gpu_power_connectors_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE gpu_display_outputs (
    hardware_id BIGINT UNSIGNED NOT NULL,
    output_type VARCHAR(32) NOT NULL,
    quantity TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (hardware_id, output_type),
    CONSTRAINT chk_gpu_display_output_quantity CHECK (quantity > 0),
    CONSTRAINT fk_gpu_display_outputs_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- CPUs (category slug: cpus)
CREATE TABLE
  cpus (
    hardware_id BIGINT UNSIGNED NOT NULL,
    socket VARCHAR(64) NULL, -- AM5, LGA1700
    architecture VARCHAR(64) NULL, -- Zen 4, Raptor Lake
    cores TINYINT UNSIGNED NULL,
    threads TINYINT UNSIGNED NULL,
    base_clock_ghz DECIMAL(4, 2) NULL,
    boost_clock_ghz DECIMAL(4, 2) NULL,
    tdp_watts SMALLINT UNSIGNED NULL,
    integrated_graphics VARCHAR(128) NULL,
    unlocked TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
    CONSTRAINT chk_cpus_unlocked CHECK (unlocked IN (0, 1)),
    CONSTRAINT fk_cpus_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- Motherboards (category slug: motherboards)
CREATE TABLE
  motherboards (
    hardware_id BIGINT UNSIGNED NOT NULL,
    socket VARCHAR(64) NULL,
    chipset VARCHAR(64) NULL, -- B650, Z790
    form_factor VARCHAR(32) NULL, -- ATX, mATX, ITX
    memory_type VARCHAR(32) NULL, -- DDR5
    max_memory_gb SMALLINT UNSIGNED NULL,
    memory_slots TINYINT UNSIGNED NULL,
    pcie_x16_slots TINYINT UNSIGNED NULL,
    m2_slots TINYINT UNSIGNED NULL,
    sata_ports TINYINT UNSIGNED NULL,
    wifi TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
    CONSTRAINT chk_motherboards_wifi CHECK (wifi IN (0, 1)),
    CONSTRAINT fk_motherboards_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- PSUs (category slug: psus)
CREATE TABLE
  psus (
    hardware_id BIGINT UNSIGNED NOT NULL,
    wattage SMALLINT UNSIGNED NULL,
    efficiency_rating VARCHAR(32) NULL, -- 80+ Gold
    modular_type ENUM ('non_modular', 'semi_modular', 'fully_modular') NULL,
    form_factor VARCHAR(32) NULL, -- ATX, SFX
    pcie_connectors TINYINT UNSIGNED NULL,
    sata_connectors TINYINT UNSIGNED NULL,
    PRIMARY KEY (hardware_id),
    CONSTRAINT fk_psus_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- Memory / RAM (category slug: memory)
CREATE TABLE
  memory (
    hardware_id BIGINT UNSIGNED NOT NULL,
    memory_type VARCHAR(32) NULL, -- DDR4, DDR5
    capacity_gb SMALLINT UNSIGNED NULL,
    kit_modules TINYINT UNSIGNED NULL, -- 2x16GB → kit_modules=2
    speed_mhz INT UNSIGNED NULL,
    cas_latency VARCHAR(16) NULL, -- CL36
    voltage DECIMAL(3, 2) NULL,
    rgb TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
    CONSTRAINT chk_memory_rgb CHECK (rgb IN (0, 1)),
    CONSTRAINT fk_memory_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- AIO liquid coolers (category slug: aios)
CREATE TABLE
  aios (
    hardware_id BIGINT UNSIGNED NOT NULL,
    radiator_mm SMALLINT UNSIGNED NULL, -- 240, 360
    fan_count TINYINT UNSIGNED NULL,
    fan_size_mm TINYINT UNSIGNED NULL,
    rgb TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
    CONSTRAINT chk_aios_rgb CHECK (rgb IN (0, 1)),
    CONSTRAINT fk_aios_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- Air coolers (category slug: air-coolers)
CREATE TABLE
  air_coolers (
    hardware_id BIGINT UNSIGNED NOT NULL,
    height_mm SMALLINT UNSIGNED NULL,
    fan_count TINYINT UNSIGNED NULL,
    fan_size_mm TINYINT UNSIGNED NULL,
    tdp_rating_watts SMALLINT UNSIGNED NULL,
    rgb TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
    CONSTRAINT chk_air_coolers_rgb CHECK (rgb IN (0, 1)),
    CONSTRAINT fk_air_coolers_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  CREATE TABLE hardware_socket_compatibilities (
      hardware_id BIGINT UNSIGNED NOT NULL,
      socket_type VARCHAR(64) NOT NULL,
      PRIMARY KEY (hardware_id, socket_type),
      KEY idx_socket_compatibilities_socket (socket_type, hardware_id),
      CONSTRAINT fk_socket_compatibilities_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- Case fans (category slug: case-fans)
CREATE TABLE
  case_fans (
    hardware_id BIGINT UNSIGNED NOT NULL,
    size_mm TINYINT UNSIGNED NULL, -- 120, 140
    max_rpm SMALLINT UNSIGNED NULL,
    airflow_cfm DECIMAL(5, 2) NULL,
    noise_db DECIMAL(4, 1) NULL,
    pwm TINYINT (1) NOT NULL DEFAULT 0,
    rgb TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
    CONSTRAINT chk_case_fans_boolean_flags CHECK (pwm IN (0, 1) AND rgb IN (0, 1)),
    CONSTRAINT fk_case_fans_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- SSDs (category slug: ssds)
CREATE TABLE
  ssds (
    hardware_id BIGINT UNSIGNED NOT NULL,
    capacity_gb INT UNSIGNED NULL,
    interface_type VARCHAR(32) NULL, -- NVMe, SATA
    form_factor VARCHAR(32) NULL, -- M.2 2280, 2.5"
    nand_type VARCHAR(32) NULL, -- TLC, QLC
    pcie_gen VARCHAR(16) NULL, -- Gen4, Gen5
    read_speed_mbps INT UNSIGNED NULL,
    write_speed_mbps INT UNSIGNED NULL,
    PRIMARY KEY (hardware_id),
    CONSTRAINT fk_ssds_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- HDDs (category slug: hdds)
CREATE TABLE
  hdds (
    hardware_id BIGINT UNSIGNED NOT NULL,
    capacity_gb INT UNSIGNED NULL,
    rpm SMALLINT UNSIGNED NULL,
    cache_mb INT UNSIGNED NULL,
    form_factor VARCHAR(16) NULL, -- 3.5", 2.5"
    interface_type VARCHAR(32) NULL, -- SATA
    PRIMARY KEY (hardware_id),
    CONSTRAINT fk_hdds_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  CREATE TABLE pc_cases (
    hardware_id BIGINT UNSIGNED NOT NULL,
    form_factor VARCHAR(64) NULL, -- ATX, mATX, ITX
    side_panel VARCHAR(64) NULL, -- Tempered Glass, Mesh, Solid
    max_gpu_length_mm SMALLINT UNSIGNED NULL,
    max_cooler_height_mm SMALLINT UNSIGNED NULL,
    drive_bays_3_5 TINYINT UNSIGNED NULL,
    drive_bays_2_5 TINYINT UNSIGNED NULL,
    length_mm SMALLINT UNSIGNED NULL,
    width_mm SMALLINT UNSIGNED NULL,
    height_mm SMALLINT UNSIGNED NULL,
    PRIMARY KEY (hardware_id),
    CONSTRAINT fk_pc_cases_hardware FOREIGN KEY (hardware_id) REFERENCES hardware(id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 3. LISTINGS (marketplace)
-- -----------------------------------------------------------------------------
CREATE TABLE listings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    seller_id BIGINT UNSIGNED NOT NULL,
    category_id SMALLINT UNSIGNED NOT NULL,
    hardware_id BIGINT UNSIGNED NULL, -- link to Tech Database catalog row
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    condition_grade ENUM ('New', 'Like New', 'Good', 'Fair') NOT NULL,
    price_cents INT UNSIGNED NOT NULL, -- ZAR stored as cents (850000 = R8,500.00)
    location_province VARCHAR(64) NULL,
    status ENUM (
      'AVAILABLE',
      'OFFERED',
      'PENDING',
      'COMMITED',
      'SOLD'
    ) NOT NULL DEFAULT 'AVAILABLE',
    is_deleted TINYINT (1) NOT NULL DEFAULT 0, -- Soft delete flag
    view_count INT UNSIGNED NOT NULL DEFAULT 0, -- cache of unique listing_views rows
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    KEY idx_listings_seller (seller_id, is_deleted),
    KEY idx_listings_category (category_id),
    KEY idx_listings_status (status),
    KEY idx_listings_price (price_cents),
    KEY idx_listings_location (location_province),
    KEY idx_listings_deleted (is_deleted), -- For fast filtering of active listings
    KEY idx_listings_marketplace (status, is_deleted, published_at),
    KEY idx_listings_category_marketplace (category_id, status, is_deleted, price_cents),
    FULLTEXT KEY ft_listings_search (title, description),
    CONSTRAINT chk_listings_price_positive CHECK (price_cents > 0),
    CONSTRAINT chk_listings_is_deleted CHECK (is_deleted IN (0, 1)),
    CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_listings_category FOREIGN KEY (category_id) REFERENCES categories (id) ON UPDATE CASCADE,
    CONSTRAINT fk_listings_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE
  listing_images (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    listing_id BIGINT UNSIGNED NOT NULL,
    url VARCHAR(512) NOT NULL,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
    is_primary TINYINT (1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_listing_images_listing (listing_id),
    UNIQUE KEY uq_listing_images_sort (listing_id, sort_order),
    CONSTRAINT chk_listing_images_is_primary CHECK (is_primary IN (0, 1)),
    CONSTRAINT fk_listing_images_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

CREATE TABLE
  listing_specs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    listing_id BIGINT UNSIGNED NOT NULL,
    spec_key VARCHAR(100) NOT NULL, -- Brand, Model, Memory, TDP, etc.
    spec_value VARCHAR(255) NOT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_listing_specs_listing (listing_id),
    CONSTRAINT fk_listing_specs_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

  CREATE TABLE listing_views (
    listing_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (listing_id, user_id),
    CONSTRAINT fk_views_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT fk_views_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 4. OFFERS & NEGOTIATION
-- -----------------------------------------------------------------------------
CREATE TABLE
  offers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    listing_id BIGINT UNSIGNED NOT NULL,
    buyer_id BIGINT UNSIGNED NOT NULL,
    amount_cents INT UNSIGNED NOT NULL,
    message TEXT NULL,
    status ENUM (
      'pending',
      'accepted',
      'declined',
      'withdrawn',
      'expired'
    ) NOT NULL DEFAULT 'pending',
    parent_offer_id BIGINT UNSIGNED NULL, -- counter-offer chain
    expires_at DATETIME NULL,
    responded_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_offers_listing (listing_id),
    KEY idx_offers_buyer (buyer_id),
    KEY idx_offers_status (status),
    KEY idx_offers_buyer_status (buyer_id, status, created_at),
    CONSTRAINT chk_offers_amount_positive CHECK (amount_cents > 0),
    CONSTRAINT fk_offers_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON UPDATE CASCADE,
    CONSTRAINT fk_offers_buyer FOREIGN KEY (buyer_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_offers_parent FOREIGN KEY (parent_offer_id) REFERENCES offers (id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 5. TRANSACTIONS & ESCROW (5-step tracker)
-- agreed_price_cents is a transaction-time price snapshot and must not be
-- recalculated from a listing's current price. Treat it as immutable after trade
-- creation except for an explicit, audited correction.
-- -----------------------------------------------------------------------------
CREATE TABLE
  transactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    public_id VARCHAR(32) NOT NULL, -- TX-9082314 (human-readable)
    listing_id BIGINT UNSIGNED NOT NULL,
    offer_id BIGINT UNSIGNED NULL,
    buyer_id BIGINT UNSIGNED NOT NULL,
    seller_id BIGINT UNSIGNED NOT NULL,
    agreed_price_cents INT UNSIGNED NOT NULL,
    status ENUM (
      'pending',
      'committed',
      'completed',
      'cancelled',
      'disputed'
    ) NOT NULL DEFAULT 'pending',
    escrow_step TINYINT UNSIGNED NOT NULL DEFAULT 1,
    step_expires_at DATETIME,
    -- 1 Awaiting Payment | 2 Awaiting Dispatch | 3 In Transit
    -- 4 Hardware Inspection | 5 Complete
    escrow_released TINYINT (1) NOT NULL DEFAULT 0,
    shipped_at DATETIME NULL,
    delivered_at DATETIME NULL,
    inspection_ends_at DATETIME NULL, -- 48h testing window (step 4)
    completed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    cancel_reason TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_transactions_public_id (public_id),
    UNIQUE KEY uq_transactions_offer (offer_id),
    KEY idx_transactions_buyer (buyer_id),
    KEY idx_transactions_seller (seller_id),
    KEY idx_transactions_listing (listing_id),
    KEY idx_transactions_status (status, created_at),
    CONSTRAINT chk_transactions_price_positive CHECK (agreed_price_cents > 0),
    CONSTRAINT chk_transactions_escrow_step CHECK (escrow_step BETWEEN 1 AND 5),
    CONSTRAINT chk_transactions_distinct_parties CHECK (buyer_id <> seller_id),
    CONSTRAINT chk_transactions_escrow_released CHECK (escrow_released IN (0, 1)),
    CONSTRAINT fk_transactions_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_offer FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_buyer FOREIGN KEY (buyer_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_seller FOREIGN KEY (seller_id) REFERENCES users (id) ON UPDATE CASCADE
  ) ENGINE = InnoDB;

CREATE TABLE
  transaction_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    transaction_id BIGINT UNSIGNED NOT NULL,
    actor_id BIGINT UNSIGNED NULL,
    event_type VARCHAR(64) NOT NULL,
    -- payment_received, marked_shipped, delivery_confirmed, funds_released,
    -- dispute_opened, whatsapp_bridge_activated, whatsapp_bridge_expired, etc.
    from_step TINYINT UNSIGNED NULL,
    to_step TINYINT UNSIGNED NULL,
    metadata_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_tx_events_transaction (transaction_id),
    CONSTRAINT fk_tx_events_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tx_events_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 6. PAYMENTS (PayFast)
-- -----------------------------------------------------------------------------
CREATE TABLE
  payments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    transaction_id BIGINT UNSIGNED NOT NULL,
    payer_id BIGINT UNSIGNED NOT NULL,
    provider ENUM ('payfast') NOT NULL DEFAULT 'payfast',
    m_payment_id VARCHAR(64) NOT NULL, -- PayFast custom payment id
    pf_payment_id VARCHAR(64) NULL, -- PayFast reference after callback
    amount_cents INT UNSIGNED NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'ZAR',
    status ENUM (
      'initiated',
      'complete',
      'failed',
      'cancelled',
      'refunded'
    ) NOT NULL DEFAULT 'initiated',
    merchant_id VARCHAR(32) NULL,
    notify_url VARCHAR(512) NULL,
    return_url VARCHAR(512) NULL,
    cancel_url VARCHAR(512) NULL,
    raw_notify_payload JSON NULL,
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payments_m_payment_id (m_payment_id),
    UNIQUE KEY uq_payments_pf_payment_id (pf_payment_id),
    KEY idx_payments_transaction (transaction_id),
    KEY idx_payments_status_created (status, created_at),
    CONSTRAINT chk_payments_amount_positive CHECK (amount_cents > 0),
    CONSTRAINT fk_payments_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON UPDATE CASCADE,
    CONSTRAINT fk_payments_payer FOREIGN KEY (payer_id) REFERENCES users (id) ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 7. DISPUTES
-- -----------------------------------------------------------------------------
CREATE TABLE
  disputes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    transaction_id BIGINT UNSIGNED NOT NULL,
    opened_by_id BIGINT UNSIGNED NOT NULL,
    reason_code ENUM ('damaged', 'incorrect', 'missing', 'performance') NOT NULL,
    details TEXT NOT NULL,
    status ENUM (
      'open',
      'under_review',
      'resolved_buyer',
      'resolved_seller',
      'closed'
    ) NOT NULL DEFAULT 'open',
    resolution_notes TEXT NULL,
    resolved_by_id BIGINT UNSIGNED NULL, -- admin
    resolved_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_disputes_transaction (transaction_id),
    CONSTRAINT fk_disputes_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON UPDATE CASCADE,
    CONSTRAINT fk_disputes_opened_by FOREIGN KEY (opened_by_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_disputes_resolved_by FOREIGN KEY (resolved_by_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

CREATE TABLE
  dispute_evidence (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    dispute_id BIGINT UNSIGNED NOT NULL,
    file_url VARCHAR(512) NOT NULL,
    file_name VARCHAR(255) NULL,
    sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_dispute_evidence_dispute (dispute_id),
    CONSTRAINT fk_dispute_evidence_dispute FOREIGN KEY (dispute_id) REFERENCES disputes (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 8. REVIEWS
-- -----------------------------------------------------------------------------
CREATE TABLE reviews (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    transaction_id BIGINT UNSIGNED NOT NULL,
    reviewer_id BIGINT UNSIGNED NOT NULL,
    reviewee_id BIGINT UNSIGNED NOT NULL,
    
    -- PLACED DIRECTLY AS A COLUMN-LEVEL INLINE CONSTRAINT
    rating TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    comment TEXT NOT NULL,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    is_flagged TINYINT(1) NOT NULL DEFAULT 0,
    deleted_at DATETIME NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reviews_transaction_reviewer (transaction_id, reviewer_id),
    KEY idx_reviews_reviewee (reviewee_id),
    KEY idx_reviews_is_deleted (is_deleted),
    CONSTRAINT chk_reviews_boolean_flags CHECK (
      is_deleted IN (0, 1) AND is_flagged IN (0, 1)
    ),
    CONSTRAINT fk_reviews_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_reviewee FOREIGN KEY (reviewee_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT chk_reviews_distinct_parties CHECK (reviewer_id <> reviewee_id)
) ENGINE = InnoDB;

CREATE TABLE review_reports (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    review_id BIGINT UNSIGNED NOT NULL,
    reporter_id BIGINT UNSIGNED NOT NULL,
    reason_code VARCHAR(50) NOT NULL, -- e.g., 'SPAM', 'HARASSMENT', 'ABUSE', 'OTHER'
    details TEXT NULL,
    status ENUM('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    -- Prevents the same user from spam-reporting the exact same review multiple times
    UNIQUE KEY uq_review_reporter (review_id, reporter_id), 
    KEY idx_review_reports_queue (status, created_at),
    CONSTRAINT fk_reports_review FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (id) ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 9. REPORTS (users & listings) — admin queues
-- -----------------------------------------------------------------------------
CREATE TABLE
  user_reports (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    reporter_id BIGINT UNSIGNED NOT NULL,
    reported_user_id BIGINT UNSIGNED NOT NULL,
    transaction_id BIGINT UNSIGNED NULL,
    reason_code ENUM (
      'payment',
      'communication',
      'item_issue',
      'no_show',
      'other'
    ) NOT NULL,
    details TEXT NOT NULL,
    status ENUM (
      'pending',
      'reviewing',
      'action_taken',
      'dismissed'
    ) NOT NULL DEFAULT 'pending',
    admin_notes TEXT NULL,
    reviewed_by_id BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_user_reports_reported (reported_user_id),
    KEY idx_user_reports_status (status, created_at),
    CONSTRAINT fk_user_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_user_reports_reported FOREIGN KEY (reported_user_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_user_reports_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_user_reports_reviewer FOREIGN KEY (reviewed_by_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

CREATE TABLE
  listing_reports (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    reporter_id BIGINT UNSIGNED NOT NULL,
    listing_id BIGINT UNSIGNED NOT NULL,
    reason VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    status ENUM (
      'pending',
      'reviewing',
      'action_taken',
      'dismissed'
    ) NOT NULL DEFAULT 'pending',
    admin_notes TEXT NULL,
    reviewed_by_id BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_listing_reports_listing (listing_id),
    KEY idx_listing_reports_status (status, created_at),
    CONSTRAINT fk_listing_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_listing_reports_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON UPDATE CASCADE,
    CONSTRAINT fk_listing_reports_reviewer FOREIGN KEY (reviewed_by_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 10. NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE whatsapp_bridges (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    transaction_id BIGINT UNSIGNED NOT NULL,
    buyer_id BIGINT UNSIGNED NOT NULL,
    seller_id BIGINT UNSIGNED NOT NULL,
    status ENUM ('active', 'expired', 'revoked') NOT NULL DEFAULT 'active',
    expires_at DATETIME NOT NULL,
    expired_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_whatsapp_bridges_transaction (transaction_id, status),
    KEY idx_whatsapp_bridges_expiry (status, expires_at),
    CONSTRAINT chk_whatsapp_bridges_distinct_parties CHECK (buyer_id <> seller_id),
    CONSTRAINT fk_whatsapp_bridges_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_whatsapp_bridges_buyer FOREIGN KEY (buyer_id) REFERENCES users (id) ON UPDATE CASCADE,
    CONSTRAINT fk_whatsapp_bridges_seller FOREIGN KEY (seller_id) REFERENCES users (id) ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE
  notifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM ('offer', 'counter', 'bridge', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NULL,
    status ENUM ('pending', 'accepted', 'declined', 'expired') NULL,
    offer_id BIGINT UNSIGNED NULL,
    transaction_id BIGINT UNSIGNED NULL,
    listing_id BIGINT UNSIGNED NULL,
    whatsapp_bridge_id BIGINT UNSIGNED NULL,
    is_read TINYINT (1) NOT NULL DEFAULT 0,
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT (1) NOT NULL DEFAULT 0,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    KEY idx_notifications_user (user_id, is_read, created_at),
    CONSTRAINT chk_notifications_boolean_flags CHECK (
      is_read IN (0, 1) AND is_deleted IN (0, 1)
    ),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_offer FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_whatsapp_bridge FOREIGN KEY (whatsapp_bridge_id) REFERENCES whatsapp_bridges (id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 11. BUILD DOCTOR (saved compatibility checks)
-- -----------------------------------------------------------------------------
CREATE TABLE user_builds (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(128) NULL,
    cpu_id BIGINT UNSIGNED,
    gpu_id BIGINT UNSIGNED,
    psu_id BIGINT UNSIGNED,
    -- Display-name columns preserve what the owner selected at save time; do not
    -- rewrite them when the hardware catalog changes.
    cpu_display_name VARCHAR(255),
    gpu_display_name VARCHAR(255),
    psu_display_name VARCHAR(255),
    -- Cached compatibility result; refresh in the same transaction when a build
    -- is explicitly recalculated, not on unrelated catalog edits.
    result_json JSON NULL,
    is_deleted TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_user_active (user_id, is_deleted, created_at),
    CONSTRAINT chk_user_builds_is_deleted CHECK (is_deleted IN (0, 1)),
    CONSTRAINT fk_user_builds_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_build_cpu FOREIGN KEY (cpu_id) REFERENCES hardware(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_build_gpu FOREIGN KEY (gpu_id) REFERENCES hardware(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_build_psu FOREIGN KEY (psu_id) REFERENCES hardware(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 12. SUPPORT & ADMIN
-- -----------------------------------------------------------------------------
CREATE TABLE
  support_messages (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    contact_preference ENUM('Email', 'WhatsApp') NOT NULL DEFAULT 'Email',
    status ENUM ('new', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'new',
    assigned_to BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_support_status (status, created_at),
    CONSTRAINT fk_support_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_support_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

CREATE TABLE
  user_strikes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    issued_by BIGINT UNSIGNED NULL,
    severity ENUM ('warning', 'danger', 'critical') NOT NULL DEFAULT 'warning',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_user_strikes_user_created (user_id, created_at),
    CONSTRAINT fk_user_strikes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_user_strikes_issuer FOREIGN KEY (issued_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB;

-- =============================================================================
-- PostgreSQL migration plan (documentation only; this section is not executable SQL)
-- =============================================================================
-- Keep this MySQL schema as the source for the current PHP/phpMyAdmin deployment.
-- Build a separate, versioned PostgreSQL migration set; never try to run this file
-- directly on PostgreSQL. Target a relational client-server deployment using
-- PostgreSQL's disk-backed MVCC heap, WAL, and B-tree indexes. Keep it unpartitioned
-- initially; evaluate time-range partitioning for transaction_events/payments only
-- after volume, retention, and query benchmarks justify it.
--
-- 1. Inventory and preflight
--    * Record table/column counts, row counts, sequences, indexes, FKs, and current
--      application queries. Take a tested backup and verify a restore.
--    * Reject or repair duplicate emails/public IDs/token selectors, invalid enum
--      values, negative/zero prices, out-of-range ratings/escrow steps, orphan rows,
--      and inconsistent soft-delete/counter values before adding target constraints.
--    * Reconcile trust_score against received reviews, trade_count against completed
--      transactions, strike_count against user_strikes, and view_count against
--      listing_views; retain transaction price and build display-name snapshots.
--    * For existing MySQL data, review reg_type='admin'/'moderator' rows and any
--      conflicting role_id values before changing role assignments.
--
-- 2. Create and version the PostgreSQL schema
--    * Track immutable, checksummed migrations in a schema_migrations table. Test
--      each migration and rollback/forward-fix procedure on a production-sized copy.
--    * Map AUTO_INCREMENT to GENERATED BY DEFAULT AS IDENTITY. Map unsigned integer
--      types to an adequate signed type plus CHECK (column >= 0), or a larger type
--      where the MySQL unsigned range exceeds PostgreSQL's signed range. Map TINYINT(1)
--      flags to BOOLEAN after validating that stored values are only 0/1.
--    * Map DATETIME to TIMESTAMPTZ for instants (preserving the intended time zone);
--      keep calendar-only values as DATE. Replace ON UPDATE CURRENT_TIMESTAMP with
--      explicit application updates or a small BEFORE UPDATE trigger.
--    * Map JSON to JSONB. Map fixed, slowly changing enums to CHECK constraints;
--      use lookup tables for values that need metadata or independent evolution.
--      Preserve every default, nullability rule, uniqueness rule, FK action, and CHECK.
--    * Preflight email collisions under the target comparison rules. The current
--      utf8mb4_unicode_ci collation is case- and accent-insensitive; CITEXT or a
--      unique index on lower(email) preserves case-insensitivity, but not necessarily
--      accent-equivalence. Choose and test the PostgreSQL normalization/collation
--      policy explicitly before creating the unique index.
--    * Seed roles with stable IDs (1=user, 3=moderator, 4=admin) before migrating
--      users. Before narrowing reg_type to buyer/seller/both, migrate legacy
--      'admin'/'moderator' values to role_id=4/3 respectively and then replace those
--      reg_type values with the business-appropriate buyer/seller/both value. Resolve
--      conflicting pre-existing role grants explicitly; do not silently downgrade
--      elevated users. Retain the frontend's role-ID contract.
--    * Map the users boolean flags to BOOLEAN and add CHECK constraints; preserve
--      trust_score's 0..5 range and the suspended_until >= suspended_at rule.
--      Keep user metric synchronization in the same transaction as the source write.
--    * Use a PostgreSQL partial unique index on (listing_id) WHERE is_primary for
--      the one-primary-image-per-listing invariant if that invariant is enforced;
--      MySQL has no equivalent partial unique index in this source schema.
--    * Replace MySQL FULLTEXT indexes with a tsvector search column and GIN index;
--      verify search tokenization and ranking against representative queries.
--    * Convert AUTO_INCREMENT/ENUM/unsigned types explicitly; PostgreSQL has no
--      unsigned integer types and does not support MySQL's automatic update timestamp.
--
-- 3. Normalize and backfill safely
--    * Preserve the child tables for GPU connectors/outputs and socket compatibility.
--      For any legacy source that still stores delimited values, parse and validate
--      those values into child rows before switching reads; parse old case dimensions
--      into millimeter columns rather than copying the original text.
--    * Expand first: add nullable target columns/tables, backfill in bounded,
--      restartable batches, and keep old and new representations consistent while
--      both application versions may be active. Make backfills idempotent.
--    * Add large indexes with CREATE INDEX CONCURRENTLY (outside a transaction).
--      Add eligible foreign keys and CHECK constraints as NOT VALID, clean remaining
--      violations, then VALIDATE CONSTRAINT. Add NOT NULL only after backfill checks.
--
-- 4. Cut over and contract
--    * Deploy code compatible with both schemas, compare reads and aggregates, then
--      switch writes/reads behind a reversible feature flag. Keep the MySQL source
--      read-only through the agreed observation window and retain a tested restore.
--    * After parity and rollback criteria pass, remove obsolete columns in a later
--      migration. Do not combine destructive cleanup with the initial cutover.
--    * Maintain trust_score/trade_count/strike_count and view_count in the same
--      transaction as their source writes (or use an explicitly monitored async
--      projection); run periodic reconciliation and alert on drift. Treat hardware
--      full_name and build result_json according to their cache/snapshot rules above.
--    * Partition high-volume event/audit tables only when measured query and archive
--      needs warrant it; account for PostgreSQL partition-key restrictions on unique
--      constraints and foreign keys before selecting a partition key.
