import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, Users } from 'lucide-react';
import { employeeService } from '../services/api';
import EmployeeModal from '../components/EmployeeModal';
import Toast from '../components/Toast';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [toast, setToast] = useState(null);
  const [emailLoading, setEmailLoading] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      showToast('Failed to fetch employees', 'error');
      console.error('Fetch employees error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setModalOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await employeeService.delete(employee.id);
        await fetchEmployees();
        showToast(`${employee.name} has been deleted successfully`);
      } catch (error) {
        showToast('Failed to delete employee', 'error');
        console.error('Delete employee error:', error);
      }
    }
  };

  const handleSave = async (employeeData) => {
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, employeeData);
        showToast(`${employeeData.name} has been updated successfully`);
      } else {
        await employeeService.create(employeeData);
        showToast(`${employeeData.name} has been added successfully`);
      }
      
      setModalOpen(false);
      setEditingEmployee(null);
      await fetchEmployees();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save employee';
      showToast(errorMessage, 'error');
      console.error('Save employee error:', error);
    }
  };

  const handleSendEmail = async (employee) => {
    try {
      setEmailLoading(prev => ({ ...prev, [employee.id]: true }));
      
      const emailData = {
        employeeId: employee.id,
        emailType: 'general',
        customMessage: `Hello ${employee.name}, this is a test email from the Employee Dashboard system.`
      };
      
      const response = await employeeService.sendEmail(emailData);
      showToast(`Email sent successfully to ${employee.name}`);
      console.log('Email response:', response);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send email';
      showToast(errorMessage, 'error');
      console.error('Send email error:', error);
    } finally {
      setEmailLoading(prev => ({ ...prev, [employee.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading employees...
      </div>
    );
  }

  return (
    <div className="employee-management">
      <div className="page-header">
        <h1>Employee Management</h1>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="table-container">
          <div className="empty-state">
            <Users />
            <h3>No employees found</h3>
            <p>Get started by adding your first employee</p>
            <button onClick={handleCreate} className="btn btn-primary">
              <Plus size={16} />
              Add First Employee
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Start Date</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td style={{ fontWeight: '600' }}>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.phone || 'N/A'}</td>
                  <td>{new Date(employee.startDate).toLocaleDateString()}</td>
                  <td>${(employee.salary || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${employee.status}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="btn-icon btn-secondary"
                        title="Edit Employee"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleSendEmail(employee)}
                        className="btn-icon btn-success"
                        title="Send Email"
                        disabled={emailLoading[employee.id]}
                      >
                        {emailLoading[employee.id] ? (
                          <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #f3f4f6', borderTop: '2px solid #10b981' }}></div>
                        ) : (
                          <Mail size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
                        className="btn-icon btn-danger"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
