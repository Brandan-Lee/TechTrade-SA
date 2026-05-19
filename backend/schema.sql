-- =============================================================================
-- TechTrade SA — MySQL 8.0+ Schema
-- Peer-to-peer PC hardware marketplace (South Africa)
-- =============================================================================
SET
  NAMES utf8mb4;

SET
  FOREIGN_KEY_CHECKS = 0;

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

CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NULL,
    hardware_id VARCHAR(255) NULL,
    province VARCHAR(64) NULL,
    avatar_url VARCHAR(512) NULL,
    reg_type ENUM ('buyer', 'seller') NOT NULL DEFAULT 'buyer',
    member_since DATE NOT NULL DEFAULT (CURRENT_DATE),
    trust_score DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    trade_count INT UNSIGNED NOT NULL DEFAULT 0,
    strike_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
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
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY index_users_role (role_id),
    KEY index_users_province (province),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE = InnoDB;

CREATE TABLE
  password_reset_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_prt_user (user_id),
    CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

CREATE TABLE
  otp_verifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NULL,
    email VARCHAR(255) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    purpose ENUM ('register', 'login', 'reset_password') NOT NULL,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_otp_email (email)
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 2. HARDWARE CATALOG (admin “Tech Database”)
--    Parent: hardware — one row per component in the master registry
--    Child:  type-specific spec table (1:1 via hardware_id PK)
-- -----------------------------------------------------------------------------
CREATE TABLE
  categories (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    group_label VARCHAR(32) NOT NULL, -- COMPONENTS, COOLING, STORAGE, CHASSIS
    name VARCHAR(64) NOT NULL, -- GPUs, CPUs, etc.
    slug VARCHAR(64) NOT NULL, -- gpus, cpus, aios, air-coolers, ...
    spec_table VARCHAR(32) NULL, -- maps to child table name (NULL if no spec table yet)
    sort_order SMALLINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_slug (slug)
  ) ENGINE = InnoDB;

-- Master registry: every catalog component lives here first
CREATE TABLE
  hardware (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_id SMALLINT UNSIGNED NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    full_name VARCHAR(255) NOT NULL, -- e.g. "NVIDIA GeForce RTX 3080 Ti FE"
    slug VARCHAR(255) NOT NULL, -- url-safe unique key
    msrp_cents INT UNSIGNED NULL, -- reference MSRP in ZAR cents
    image_url VARCHAR(512) NULL,
    is_active TINYINT (1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_hardware_slug (slug),
    KEY idx_hardware_category (category_id),
    KEY idx_hardware_brand_model (brand, model),
    FULLTEXT KEY ft_hardware_search (brand, model, full_name),
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
    power_connectors VARCHAR(64) NULL, -- 2x 8-pin
    tdp_watts SMALLINT UNSIGNED NULL,
    outputs VARCHAR(255) NULL, -- 3x DP 1.4a, 1x HDMI 2.1
    length_mm SMALLINT UNSIGNED NULL,
    slot_width TINYINT UNSIGNED NULL, -- physical slots occupied
    PRIMARY KEY (hardware_id),
    CONSTRAINT fk_gpus_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
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
    CONSTRAINT fk_memory_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- AIO liquid coolers (category slug: aios)
CREATE TABLE
  aios (
    hardware_id BIGINT UNSIGNED NOT NULL,
    radiator_mm SMALLINT UNSIGNED NULL, -- 240, 360
    fan_count TINYINT UNSIGNED NULL,
    fan_size_mm TINYINT UNSIGNED NULL,
    socket_compatibility VARCHAR(255) NULL, -- AM5, LGA1700, ...
    rgb TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
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
    socket_compatibility VARCHAR(255) NULL,
    rgb TINYINT (1) NOT NULL DEFAULT 0,
    PRIMARY KEY (hardware_id),
    CONSTRAINT fk_air_coolers_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id) ON DELETE CASCADE
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

-- -----------------------------------------------------------------------------
-- 3. LISTINGS (marketplace)
-- -----------------------------------------------------------------------------
CREATE TABLE
  listings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    seller_id BIGINT UNSIGNED NOT NULL,
    category_id SMALLINT UNSIGNED NOT NULL,
    hardware_id BIGINT UNSIGNED NULL, -- link to Tech Database catalog row
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    condition_grade ENUM ('New', 'Like New', 'Good', 'Fair') NOT NULL,
    price_cents INT UNSIGNED NOT NULL, -- ZAR stored as cents (850000 = R8,500.00)
    accepts_offers TINYINT (1) NOT NULL DEFAULT 1, -- “Or Best Offer”
    location_province VARCHAR(64) NULL,
    status ENUM (
      'AVAILABLE',
      'OFFERED',
      'PENDING',
      'COMMITED',
      'SOLD',
    ) NOT NULL DEFAULT 'AVAILABLE',
    is_featured TINYINT (1) NOT NULL DEFAULT 0,
    view_count INT UNSIGNED NOT NULL DEFAULT 0,
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    PRIMARY KEY (id),
    KEY idx_listings_seller (seller_id),
    KEY idx_listings_category (category_id),
    KEY idx_listings_status (status),
    KEY idx_listings_price (price_cents),
    KEY idx_listings_location (location_province),
    FULLTEXT KEY ft_listings_search (title, description),
    CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users (id),
    CONSTRAINT fk_listings_category FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT fk_listings_hardware FOREIGN KEY (hardware_id) REFERENCES hardware (id)
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
    CONSTRAINT fk_offers_listing FOREIGN KEY (listing_id) REFERENCES listings (id),
    CONSTRAINT fk_offers_buyer FOREIGN KEY (buyer_id) REFERENCES users (id),
    CONSTRAINT fk_offers_parent FOREIGN KEY (parent_offer_id) REFERENCES offers (id)
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 5. TRANSACTIONS & ESCROW (5-step tracker)
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
    -- 1 Awaiting Payment | 2 Awaiting Dispatch | 3 In Transit
    -- 4 Hardware Inspection | 5 Complete
    escrow_released TINYINT (1) NOT NULL DEFAULT 0,
    tracking_number VARCHAR(128) NULL,
    carrier_name VARCHAR(64) NULL,
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
    KEY idx_transactions_buyer (buyer_id),
    KEY idx_transactions_seller (seller_id),
    KEY idx_transactions_listing (listing_id),
    KEY idx_transactions_status (status),
    CONSTRAINT fk_transactions_listing FOREIGN KEY (listing_id) REFERENCES listings (id),
    CONSTRAINT fk_transactions_offer FOREIGN KEY (offer_id) REFERENCES offers (id),
    CONSTRAINT fk_transactions_buyer FOREIGN KEY (buyer_id) REFERENCES users (id),
    CONSTRAINT fk_transactions_seller FOREIGN KEY (seller_id) REFERENCES users (id)
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 5b. WHATSAPP TTL BRIDGES (per-transaction ephemeral contact channel)
--     UI: WhatsAppTTLPage (user policy), MyTransactions “Open TTL Bridge”,
--         TOSModal 24h bridge, notifications.type = 'bridge'
-- -----------------------------------------------------------------------------
CREATE TABLE
  whatsapp_bridges (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    transaction_id BIGINT UNSIGNED NOT NULL,
    buyer_id BIGINT UNSIGNED NOT NULL,
    seller_id BIGINT UNSIGNED NOT NULL,
    ttl_preset ENUM ('24h', '7d', '90d', 'custom') NOT NULL,
    ttl_custom_days TINYINT UNSIGNED NULL,
    expires_at DATETIME NOT NULL,
    status ENUM ('pending', 'active', 'expired', 'revoked') NOT NULL DEFAULT 'pending',
    activated_at DATETIME NULL,
    expired_at DATETIME NULL,
    revoked_at DATETIME NULL,
    revoked_by_id BIGINT UNSIGNED NULL,
    -- Ephemeral channel fields — MUST be NULLed when status -> expired/revoked
    bridge_token_hash VARCHAR(255) NULL,
    wa_deeplink VARCHAR(512) NULL,
    -- Dispute-only metadata after purge (no phone numbers — POPIA / zero retention)
    audit_metadata_json JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_whatsapp_bridges_transaction (transaction_id),
    KEY idx_whatsapp_bridges_expires (status, expires_at),
    KEY idx_whatsapp_bridges_buyer (buyer_id),
    KEY idx_whatsapp_bridges_seller (seller_id),
    CONSTRAINT fk_whatsapp_bridges_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id),
    CONSTRAINT fk_whatsapp_bridges_buyer FOREIGN KEY (buyer_id) REFERENCES users (id),
    CONSTRAINT fk_whatsapp_bridges_seller FOREIGN KEY (seller_id) REFERENCES users (id),
    CONSTRAINT fk_whatsapp_bridges_revoked_by FOREIGN KEY (revoked_by_id) REFERENCES users (id),
    CONSTRAINT chk_whatsapp_bridges_custom_days CHECK (
      ttl_preset <> 'custom'
      OR (
        ttl_custom_days IS NOT NULL
        AND ttl_custom_days BETWEEN 1 AND 365
      )
    )
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
    CONSTRAINT fk_tx_events_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE
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
    KEY idx_payments_transaction (transaction_id),
    CONSTRAINT fk_payments_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id),
    CONSTRAINT fk_payments_payer FOREIGN KEY (payer_id) REFERENCES users (id)
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
    CONSTRAINT fk_disputes_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id),
    CONSTRAINT fk_disputes_opened_by FOREIGN KEY (opened_by_id) REFERENCES users (id),
    CONSTRAINT fk_disputes_resolved_by FOREIGN KEY (resolved_by_id) REFERENCES users (id)
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
CREATE TABLE
  reviews (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    transaction_id BIGINT UNSIGNED NOT NULL,
    reviewer_id BIGINT UNSIGNED NOT NULL,
    reviewee_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL, -- 1–5
    comment TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reviews_transaction_reviewer (transaction_id, reviewer_id),
    KEY idx_reviews_reviewee (reviewee_id),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_reviews_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id),
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users (id),
    CONSTRAINT fk_reviews_reviewee FOREIGN KEY (reviewee_id) REFERENCES users (id)
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
    KEY idx_user_reports_status (status),
    CONSTRAINT fk_user_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (id),
    CONSTRAINT fk_user_reports_reported FOREIGN KEY (reported_user_id) REFERENCES users (id),
    CONSTRAINT fk_user_reports_transaction FOREIGN KEY (transaction_id) REFERENCES transactions (id)
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
    KEY idx_listing_reports_status (status),
    CONSTRAINT fk_listing_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (id),
    CONSTRAINT fk_listing_reports_listing FOREIGN KEY (listing_id) REFERENCES listings (id)
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 10. NOTIFICATIONS
-- -----------------------------------------------------------------------------
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
    PRIMARY KEY (id),
    KEY idx_notifications_user (user_id, is_read),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_whatsapp_bridge FOREIGN KEY (whatsapp_bridge_id) REFERENCES whatsapp_bridges (id) ON DELETE SET NULL
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- 11. BUILD DOCTOR (saved compatibility checks)
-- -----------------------------------------------------------------------------
CREATE TABLE
  user_builds (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(128) NULL,
    cpu_text VARCHAR(255) NOT NULL,
    gpu_text VARCHAR(255) NOT NULL,
    psu_text VARCHAR(255) NOT NULL,
    result_json JSON NULL, -- bottleneck / wattage analysis output
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_user_builds_user (user_id),
    CONSTRAINT fk_user_builds_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
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
    status ENUM ('new', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'new',
    assigned_to BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_support_status (status)
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
    KEY idx_user_strikes_user (user_id),
    CONSTRAINT fk_user_strikes_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  ) ENGINE = InnoDB;

-- -----------------------------------------------------------------------------
-- SEED: roles & categories (matches FilterBar / IntelSection)
-- -----------------------------------------------------------------------------
INSERT INTO
  roles (code, name)
VALUES
  ('buyer', 'Buyer'),
  ('seller', 'Seller'),
  ('moderator', 'Moderator'),
  ('admin', 'Administrator');

INSERT INTO
  categories (group_label, name, slug, spec_table, sort_order)
VALUES
  ('COMPONENTS', 'GPUs', 'gpus', 'gpus', 1),
  ('COMPONENTS', 'CPUs', 'cpus', 'cpus', 2),
  (
    'COMPONENTS',
    'Motherboards',
    'motherboards',
    'motherboards',
    3
  ),
  ('COMPONENTS', 'PSUs', 'psus', 'psus', 4),
  ('COMPONENTS', 'Memory', 'memory', 'memory', 5),
  ('COOLING', 'AIOs', 'aios', 'aios', 10),
  (
    'COOLING',
    'Air Coolers',
    'air-coolers',
    'air_coolers',
    11
  ),
  (
    'COOLING',
    'Case Fans',
    'case-fans',
    'case_fans',
    12
  ),
  ('STORAGE', 'SSDs', 'ssds', 'ssds', 20),
  ('STORAGE', 'HDDs', 'hdds', 'hdds', 21),
  ('CHASSIS', 'PC Cases', 'pc-cases', NULL, 30);

-- Example catalog row (GPU) — insert hardware first, then child specs
-- INSERT INTO hardware (category_id, brand, model, full_name, slug)
--   VALUES (1, 'NVIDIA', 'GeForce RTX 3080 Ti FE', 'NVIDIA GeForce RTX 3080 Ti FE', 'nvidia-rtx-3080-ti-fe');
-- INSERT INTO gpus (hardware_id, vram_gb, vram_type, core_clock_mhz, boost_clock_mhz, pcie_version, power_connectors, tdp_watts, outputs)
--   VALUES (LAST_INSERT_ID(), 12, 'GDDR6X', 1665, 1770, 'PCIe 4.0 x16', '2x 8-pin', 350, '3x DP 1.4a, 1x HDMI 2.1');
SET
  FOREIGN_KEY_CHECKS = 1;