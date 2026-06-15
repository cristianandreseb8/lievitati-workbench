/*
  # Create recipes table

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subtitle` (text)
      - `tag` (text)
      - `categoria` (text)
      - `conservation` (text)
      - `baking` (text)
      - `temp_baking` (text)
      - `peso_pieza` (numeric)
      - `merma` (numeric)
      - `tiempo_elaboracion` (text)
      - `precio` (numeric)
      - `foto` (text, nullable)
      - `process` (jsonb)
      - `ingredients` (jsonb)
      - `steps` (jsonb)
      - `sort_order` (integer) - controls display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public read access (recipes are not user-specific)
    - Authenticated users can insert/update/delete
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  categoria text NOT NULL DEFAULT '',
  conservation text NOT NULL DEFAULT '',
  baking text NOT NULL DEFAULT '',
  temp_baking text NOT NULL DEFAULT '',
  peso_pieza numeric NOT NULL DEFAULT 0,
  merma numeric NOT NULL DEFAULT 0,
  tiempo_elaboracion text NOT NULL DEFAULT '',
  precio numeric NOT NULL DEFAULT 0,
  foto text,
  process jsonb NOT NULL DEFAULT '[]',
  ingredients jsonb NOT NULL DEFAULT '[]',
  steps jsonb NOT NULL DEFAULT '[]',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recipes"
  ON recipes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (true);
