import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
      current: location.pathname === '/',
    },
    {
      name: 'Employee Management',
      href: '/employees',
      icon: Users,
      current: location.pathname === '/employees',
    },
  ];

  return (
    <div className="app">
      {/* Mobile menu button */}
      <div className="mobile-menu-button md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-600"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>🏢 Employee Portal</h1>
        </div>

        <nav className="nav-menu">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="nav-item">
                <Link
                  to={item.href}
                  className={`nav-link ${item.current ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <div style={{ padding: '1rem', borderTop: '1px solid #334155', fontSize: '0.875rem', color: '#94a3b8' }}>
            <p>v1.0.0</p>
            <p>Built with React & n8n</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
