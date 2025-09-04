/*
  # Add user type field to users table

  1. Changes
    - Add `user_type` column to `users` table
    - Set as required field with specific allowed values
    - Add check constraint for valid values

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE users ADD COLUMN user_type text NOT NULL DEFAULT 'guest';
  END IF;
END $$;

-- Add check constraint for valid user types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'users_user_type_check'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_user_type_check 
    CHECK (user_type IN ('apprentice_dk', 'salon_abroad', 'guest'));
  END IF;
END $$;