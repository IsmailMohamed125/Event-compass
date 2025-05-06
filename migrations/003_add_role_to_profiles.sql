-- Add 'role' column to profiles table
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'staff'));

-- Update some users to be staff (example)
UPDATE profiles SET role = 'staff' WHERE full_name = 'John Doe';
-- You can update more users as needed 