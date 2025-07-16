import React, { useState, useEffect } from 'react';
import { Users, Building2, DollarSign, UserPlus } from 'lucide-react';
import { dashboardService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message" style={{ 
          background: '#fee2e2', 
          border: '1px solid #fecaca', 
          color: '#991b1b', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          {error}
          <button 
            onClick={fetchStats}
            style={{ 
              marginLeft: '1rem', 
              background: '#991b1b', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>Total Employees</h3>
              <div className="stat-value">{stats?.totalEmployees || 0}</div>
            </div>
            <Users size={32} style={{ color: '#3b82f6' }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>Active Employees</h3>
              <div className="stat-value">{stats?.activeEmployees || 0}</div>
            </div>
            <UserPlus size={32} style={{ color: '#10b981' }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>Departments</h3>
              <div className="stat-value">{stats?.departments || 0}</div>
            </div>
            <Building2 size={32} style={{ color: '#f59e0b' }} />
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3>Average Salary</h3>
              <div className="stat-value">
                ${(stats?.averageSalary || 0).toLocaleString()}
              </div>
            </div>
            <DollarSign size={32} style={{ color: '#8b5cf6' }} />
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="chart-container">
        <h3>Department Breakdown</h3>
        {stats?.departmentBreakdown && Object.keys(stats.departmentBreakdown).length > 0 ? (
          <div className="department-list">
            {Object.entries(stats.departmentBreakdown).map(([department, count]) => (
              <div key={department} className="department-item">
                <span className="department-name">{department}</span>
                <span className="department-count">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Building2 />
            <h3>No Department Data</h3>
            <p>Add employees to see department breakdown</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="chart-container" style={{ marginTop: '2rem' }}>
        <h3>Recent Insights</h3>
        <div className="insights-grid" style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            background: '#f0f9ff', 
            borderRadius: '0.5rem',
            border: '1px solid #bae6fd'
          }}>
            <h4 style={{ color: '#0369a1', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              New Hires (Last 30 Days)
            </h4>
            <p style={{ color: '#0284c7', fontSize: '1.5rem', fontWeight: '700' }}>
              {stats?.recentHires || 0}
            </p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            background: '#f0fdf4', 
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0'
          }}>
            <h4 style={{ color: '#065f46', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Employee Retention
            </h4>
            <p style={{ color: '#059669', fontSize: '1.5rem', fontWeight: '700' }}>
              {stats?.activeEmployees && stats?.totalEmployees 
                ? `${Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}%`
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="chart-container" style={{ marginTop: '2rem' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <a href="/employees" className="btn btn-primary">
            <Users size={16} />
            Manage Employees
          </a>
          <button 
            onClick={fetchStats}
            className="btn btn-secondary"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
