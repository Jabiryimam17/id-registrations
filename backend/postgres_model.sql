-- PostgreSQL schema for NationalIDSystem
-- Execute with: psql -U <user> -d <database> -f postgres_model.sql

BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    birth_place VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    sex VARCHAR(32) NOT NULL,
    email_verification_code VARCHAR(64),
    email_code_expire TIMESTAMPTZ,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_phone_number UNIQUE (phone_number)
);

CREATE TABLE IF NOT EXISTS secrets (
    id BIGINT PRIMARY KEY,
    secret TEXT NOT NULL,
    iv TEXT NOT NULL,
    salt TEXT NOT NULL,
    CONSTRAINT fk_secrets_user
        FOREIGN KEY (id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parties (
    id VARCHAR(64) PRIMARY KEY,
    party_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_id BIGINT NOT NULL,
    short_name VARCHAR(64) NOT NULL,
    CONSTRAINT uq_parties_name_leader UNIQUE (party_name, leader_email, leader_id),
    CONSTRAINT uq_parties_short_name UNIQUE (short_name),
    CONSTRAINT fk_parties_leader
        FOREIGN KEY (leader_id)
        REFERENCES users (id)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_users_email_verified
    ON users (email, verified);

CREATE INDEX IF NOT EXISTS idx_parties_lookup
    ON parties (party_name, leader_email, leader_id);

COMMIT;