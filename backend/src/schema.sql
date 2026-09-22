-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles Type
CREATE TYPE user_role AS ENUM ('SYSTEM_ADMIN', 'FINANCIAL_MANAGER', 'DATA_ANALYST', 'STANDARD_USER');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'STANDARD_USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Ledger (Append-Only Audit Log)
CREATE TABLE transaction_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    merchant_id VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Mock Role Data for Presentation
INSERT INTO users (email, role) VALUES 
('admin@skyconnect.internal', 'SYSTEM_ADMIN'),
('finance@skyconnect.internal', 'FINANCIAL_MANAGER'),
('analyst@skyconnect.internal', 'DATA_ANALYST');
