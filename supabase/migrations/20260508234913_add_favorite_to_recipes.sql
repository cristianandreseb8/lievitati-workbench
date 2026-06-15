/*
  # Add is_favorite column to recipes

  Adds a boolean `is_favorite` field to each recipe row so that favorite state
  persists in the database and survives page reloads.

  1. Changes
    - `recipes`: new column `is_favorite` (boolean, default false)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'is_favorite'
  ) THEN
    ALTER TABLE recipes ADD COLUMN is_favorite boolean NOT NULL DEFAULT false;
  END IF;
END $$;
