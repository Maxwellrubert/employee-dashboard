// Setup script to create the employees table in Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const setupDatabase = async () => {
  try {
    console.log('🔍 Checking if employees table exists...');
    
    // Try to query the table to see if it exists
    const { data, error } = await supabase
      .from('employees')
      .select('count', { count: 'exact', head: true });

    if (error && error.code === '42P01') {
      console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
      console.log('\n📋 SQL to create the table:');
      console.log(`
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(255) DEFAULT 'General',
  phone VARCHAR(50),
  start_date DATE,
  salary INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON employees
FOR ALL USING (true);

-- For anon key access, create a permissive policy
CREATE POLICY "Enable all operations for anon users" ON employees
FOR ALL USING (true);
      `);
      console.log('\n🔗 Go to: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/editor');
    } else {
      console.log('✅ Table exists!');
      console.log('📊 Current employee count:', data?.[0]?.count || 0);
    }

  } catch (error) {
    console.error('Setup error:', error);
  }
};

setupDatabase();
