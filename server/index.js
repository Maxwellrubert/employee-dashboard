// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const { employeeDb, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

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
    const employees = await employeeDb.getAll();
    res.json({
      environment: process.env.NODE_ENV || 'development',
      employeeCount: employees.length,
      employees: employees,
      database: 'Supabase',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Debug endpoint failed', details: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await employeeDb.getAll();
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await employeeDb.getById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
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
    
    const newEmployee = await employeeDb.create({
      name,
      position,
      email,
      department: department || 'General',
      phone: phone || '',
      start_date: startDate || new Date().toISOString().split('T')[0],
      salary: salary || 0,
      status: 'active'
    });
    
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { name, position, email, department, phone, startDate, salary, status } = req.body;
    
    // Basic validation
    if (!name || !position || !email) {
      return res.status(400).json({ error: 'Name, position, and email are required' });
    }
    
    const updatedEmployee = await employeeDb.update(req.params.id, {
      name,
      position,
      email,
      department,
      phone,
      startDate,
      salary,
      status
    });
    
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await employeeDb.delete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully', employee: deletedEmployee });
  } catch (error) {
    console.error('Delete employee error:', error);
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
    
    const employee = await employeeDb.getById(employeeId);
    
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
    const employees = await employeeDb.getAll();
    
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
    await initializeDatabase();
    
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
