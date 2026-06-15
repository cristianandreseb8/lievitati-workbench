/*
  # Allow anon insert on recipes for seeding

  The app uses no authentication, so we need to allow anon users to
  insert and update recipes. This enables the app to seed initial recipes
  and save changes without requiring login.
*/

DROP POLICY IF EXISTS "Authenticated users can insert recipes" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can update recipes" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can delete recipes" ON recipes;

CREATE POLICY "Anyone can insert recipes"
  ON recipes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update recipes"
  ON recipes FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete recipes"
  ON recipes FOR DELETE
  TO anon, authenticated
  USING (true);
