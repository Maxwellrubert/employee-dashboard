// Load environment variables
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.error('SUPABASE_URL:', supabaseUrl || 'undefined');
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? 'Set (length: ' + supabaseKey.length + ')' : 'undefined');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Create employees table if it doesn't exist
const initializeDatabase = async () => {
  try {
    // Check if table exists by trying to query it
    const { data, error } = await supabase
      .from('employees')
      .select('count', { count: 'exact', head: true });

    if (error && error.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Creating employees table...');
      
      const { error: createError } = await supabase.rpc('create_employees_table');
      
      if (createError) {
        console.log('Creating table via SQL...');
        // Fallback: try to create via raw SQL
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS employees (
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
        `;
        
        // Note: This would require admin privileges, so we'll handle it differently
        console.log('Please create the employees table manually in Supabase dashboard');
      }
    }

    // Insert sample data if table is empty
    const { data: existingEmployees } = await supabase
      .from('employees')
      .select('id')
      .limit(1);

    if (!existingEmployees || existingEmployees.length === 0) {
      console.log('Inserting sample employees...');
      const sampleEmployees = [
        {
          name: 'John Doe',
          position: 'Software Engineer',
          email: 'john.doe@company.com',
          department: 'Engineering',
          phone: '+1 (555) 123-4567',
          start_date: '2023-01-15',
          salary: 75000,
          status: 'active'
        },
        {
          name: 'Jane Smith',
          position: 'Product Manager',
          email: 'jane.smith@company.com',
          department: 'Product',
          phone: '+1 (555) 234-5678',
          start_date: '2023-03-20',
          salary: 85000,
          status: 'active'
        },
        {
          name: 'Mike Johnson',
          position: 'UX Designer',
          email: 'mike.johnson@company.com',
          department: 'Design',
          phone: '+1 (555) 345-6789',
          start_date: '2023-02-10',
          salary: 70000,
          status: 'active'
        }
      ];

      const { error: insertError } = await supabase
        .from('employees')
        .insert(sampleEmployees);

      if (insertError) {
        console.error('Error inserting sample data:', insertError);
      } else {
        console.log('✅ Sample employees inserted');
      }
    }

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Employee CRUD operations
const employeeDb = {
  // Get all employees
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get employee by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new employee
  async create(employeeData) {
    const { data, error } = await supabase
      .from('employees')
      .insert([{
        ...employeeData,
        start_date: employeeData.startDate,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update employee
  async update(id, employeeData) {
    const { data, error } = await supabase
      .from('employees')
      .update({
        ...employeeData,
        start_date: employeeData.startDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete employee
  async delete(id) {
    const { data, error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Check if email exists
  async emailExists(email, excludeId = null) {
    let query = supabase
      .from('employees')
      .select('id')
      .eq('email', email);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data && data.length > 0;
  }
};

module.exports = {
  supabase,
  employeeDb,
  initializeDatabase
};
