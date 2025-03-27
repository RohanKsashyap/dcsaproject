/*
  # Fix RLS Policies for Anonymous Access

  1. Changes
    - Add policies for anonymous users to access the students table
    - Add policies for anonymous users to access the attendance table

  2. Security
    - Allow anonymous users to perform CRUD operations
    - Maintain existing authenticated user policies
*/

-- Add policies for anonymous access to students table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'students' AND policyname = 'Enable anonymous access'
  ) THEN
    CREATE POLICY "Enable anonymous access"
      ON students
      FOR ALL
      TO anon
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Add policies for anonymous access to attendance table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'attendance' AND policyname = 'Enable anonymous access'
  ) THEN
    CREATE POLICY "Enable anonymous access"
      ON attendance
      FOR ALL
      TO anon
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;