/*
  # Create app_config table

  Stores key/value JSON config for the application (single global row per key).
  Used to persist UI configuration like indicators, tab labels, tab order.

  1. New Tables
    - `app_config`
      - `key` (text, primary key)
      - `value` (jsonb)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow anon read and write (single-user app, no auth)
*/

CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select app_config"
  ON app_config FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert app_config"
  ON app_config FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update app_config"
  ON app_config FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
