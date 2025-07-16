const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Load environment variables (optional)
try {
  require('dotenv').config();
} catch (err) {
  console.log('⚠️  dotenv not found, using default environment variables');
}

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'employees.json');

// In-memory storage for Vercel serverless deployment
let employees = [
  {
    id: uuidv4(),
    name: 'John Doe',
    position: 'Software Engineer',
    email: 'john.doe@company.com',
    department: 'Engineering',
    phone: '+1 (555) 123-4567',
    startDate: '2023-01-15',
    salary: 75000,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    position: 'Product Manager',
    email: 'jane.smith@company.com',
    department: 'Product',
    phone: '+1 (555) 234-5678',
    startDate: '2023-03-20',
    salary: 85000,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Mike Johnson',
    position: 'UX Designer',
    email: 'mike.johnson@company.com',
    department: 'Design',
    phone: '+1 (555) 345-6789',
    startDate: '2023-02-10',
    salary: 70000,
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Ensure data directory exists (development only)
const ensureDataDirectory = async () => {
  if (process.env.NODE_ENV === 'production') return;
  
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Initialize data file with sample data (development only)
const initializeData = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('✅ Using in-memory storage for production');
    return;
  }
  
  try {
    await fs.access(DATA_FILE);
  } catch {
    const sampleData = [
      {
        id: uuidv4(),
        name: 'John Doe',
        position: 'Software Engineer',
        email: 'john.doe@company.com',
        department: 'Engineering',
        phone: '+1 (555) 123-4567',
        startDate: '2023-01-15',
        salary: 75000,
        status: 'active'
      },
      {
        id: uuidv4(),
        name: 'Jane Smith',
        position: 'Product Manager',
        email: 'jane.smith@company.com',
        department: 'Product',
        phone: '+1 (555) 234-5678',
        startDate: '2022-08-20',
        salary: 85000,
        status: 'active'
      },
      {
        id: uuidv4(),
        name: 'Mike Johnson',
        position: 'UX Designer',
        email: 'mike.johnson@company.com',
        department: 'Design',
        phone: '+1 (555) 345-6789',
        startDate: '2023-03-10',
        salary: 70000,
        status: 'active'
      }
    ];
    await fs.writeFile(DATA_FILE, JSON.stringify(sampleData, null, 2));
  }
};

// Helper functions
const readEmployees = async () => {
  // Use in-memory storage for production (Vercel serverless)
  if (process.env.NODE_ENV === 'production') {
    return employees;
  }
  
  // Use file storage for development
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeEmployees = async (newEmployees) => {
  // Use in-memory storage for production (Vercel serverless)
  if (process.env.NODE_ENV === 'production') {
    employees = newEmployees;
    return;
  }
  
  // Use file storage for development
  await fs.writeFile(DATA_FILE, JSON.stringify(newEmployees, null, 2));
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  try {
    const employeeData = await readEmployees();
    res.json({
      environment: process.env.NODE_ENV || 'development',
      employeeCount: employeeData.length,
      employees: employeeData,
      inMemoryStorage: process.env.NODE_ENV === 'production'
    });
  } catch (error) {
    res.status(500).json({ error: 'Debug endpoint failed', details: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await readEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employees = await readEmployees();
    const employee = employees.find(emp => emp.id === req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, position, email, department, phone, startDate, salary } = req.body;
    
    // Basic validation
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }
    
    const employees = await readEmployees();
    
    // Check if email already exists
    const existingEmployee = employees.find(emp => emp.email === email);
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this email already exists' });
    }
    
    const newEmployee = {
      id: uuidv4(),
      name,
      position,
      email,
      department: department || 'General',
      phone: phone || '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      salary: salary || 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    employees.push(newEmployee);
    await writeEmployees(employees);
    
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const employees = await readEmployees();
    const employeeIndex = employees.findIndex(emp => emp.id === req.params.id);
    
    if (employeeIndex === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const { name, position, email, department, phone, startDate, salary, status } = req.body;
    
    // Basic validation
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }
    
    // Check if email exists for other employees
    const existingEmployee = employees.find(emp => emp.email === email && emp.id !== req.params.id);
    if (existingEmployee) {
      return res.status(400).json({ error: 'Another employee with this email already exists' });
    }
    
    const updatedEmployee = {
      ...employees[employeeIndex],
      name,
      position,
      email,
      department: department || employees[employeeIndex].department,
      phone: phone || employees[employeeIndex].phone,
      startDate: startDate || employees[employeeIndex].startDate,
      salary: salary || employees[employeeIndex].salary,
      status: status || employees[employeeIndex].status,
      updatedAt: new Date().toISOString()
    };
    
    employees[employeeIndex] = updatedEmployee;
    await writeEmployees(employees);
    
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employees = await readEmployees();
    const employeeIndex = employees.findIndex(emp => emp.id === req.params.id);
    
    if (employeeIndex === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const deletedEmployee = employees.splice(employeeIndex, 1)[0];
    await writeEmployees(employees);
    
    res.json({ message: 'Employee deleted successfully', employee: deletedEmployee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Send email via n8n webhook
app.post('/api/send-email', async (req, res) => {
  try {
    const { employeeId, emailType, customMessage } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }
    
    const employees = await readEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // n8n webhook URL (n8n Cloud instance)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://maxwell-rubert.app.n8n.cloud/webhook/send-email';
    
    const emailData = {
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        department: employee.department
      },
      emailType: emailType || 'general',
      customMessage: customMessage || '',
      timestamp: new Date().toISOString()
    };
    
    // Send to n8n webhook
    const response = await axios.post(n8nWebhookUrl, emailData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json({
      message: 'Email sent successfully',
      data: response.data,
      employee: employee.name
    });
    
  } catch (error) {
    console.error('Email sending error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ 
        error: 'n8n service unavailable. Please ensure n8n is running on the configured webhook URL.' 
      });
    } else if (error.response) {
      res.status(error.response.status).json({ 
        error: `n8n webhook error: ${error.response.statusText}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  }
});

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const employees = await readEmployees();
    
    const stats = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      departments: [...new Set(employees.map(emp => emp.department))].length,
      averageSalary: employees.length > 0 
        ? Math.round(employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.length)
        : 0,
      departmentBreakdown: employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {}),
      recentHires: employees
        .filter(emp => {
          const startDate = new Date(emp.startDate);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return startDate >= thirtyDaysAgo;
        })
        .length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  // In production, serve React app for non-API routes
  if (process.env.NODE_ENV === 'production' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// Initialize and start server
const startServer = async () => {
  try {
    await ensureDataDirectory();
    await initializeData();
    
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/stats`);
        console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
        console.log(`📧 Email API: http://localhost:${PORT}/api/send-email`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Initialize for both development and production
startServer();

// Export for Vercel
module.exports = app;
