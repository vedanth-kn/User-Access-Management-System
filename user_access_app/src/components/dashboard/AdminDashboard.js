// src/components/dashboard/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { apiCallWithAuth } from '../../utils/api';
import SoftwareList from '../software/SoftwareList';
import SoftwareForm from '../software/SoftwareForm';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const { navigate } = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [softwareList, setSoftwareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {

        // Fetch software list
        const softwareResult = await apiCallWithAuth('/software', token);
        if (softwareResult.success) {
          setSoftwareList(softwareResult.data);
        } else {
          console.error('Failed to fetch software list:', softwareResult);
          setSoftwareList([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setDashboardData({
          totalUsers: 0,
          activeSessions: 0
        });
        setSoftwareList([]);
      }
      
      setLoading(false);
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSoftwareAdded = (newSoftware) => {
    console.log('New software added:', newSoftware);
    setSoftwareList(prevList => [...prevList, newSoftware]);
    setShowAddForm(false);
  };

  const handleSoftwareUpdated = (updatedSoftware) => {
    console.log('Software updated:', updatedSoftware);
    setSoftwareList(prevList => prevList.map(software => 
      software.id === updatedSoftware.id ? updatedSoftware : software
    ));
  };

  const handleSoftwareDeleted = (deletedId) => {
    console.log('Software deleted:', deletedId);
    setSoftwareList(prevList => prevList.filter(software => software.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-content">
          <div className="admin-spinner"></div>
          <p className="admin-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="admin-navbar-inner">
            <div className="admin-navbar-brand">
              <h1 className="admin-navbar-title">Admin Dashboard</h1>
            </div>
            <div className="admin-navbar-actions">
              <span className="admin-welcome-text">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="admin-logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="admin-tabs-container">
        <div className="admin-tabs-wrapper">
          <nav className="admin-tabs-nav">
            <button
              onClick={() => setActiveTab('overview')}
              className={`admin-tab-btn ${activeTab === 'overview' ? 'admin-tab-btn-active' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`admin-tab-btn ${activeTab === 'software' ? 'admin-tab-btn-active' : ''}`}
            >
              Software Management
            </button>
          </nav>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-content-wrapper">
          {activeTab === 'overview' && (
            <>
              {/* Dashboard Stats */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-content">
                    <div className="admin-stat-layout">
                      <div className="admin-stat-icon">
                        <div className="admin-stat-icon-circle admin-stat-icon-blue">
                          <span className="admin-stat-icon-text">U</span>
                        </div>
                      </div>
                      <div className="admin-stat-info">
                        <div className="admin-stat-details">
                          <dt className="admin-stat-label">
                            Total Users
                          </dt>
                          <dd className="admin-stat-value">
                            {dashboardData?.totalUsers || 0}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-content">
                    <div className="admin-stat-layout">
                      <div className="admin-stat-icon">
                        <div className="admin-stat-icon-circle admin-stat-icon-green">
                          <span className="admin-stat-icon-text">S</span>
                        </div>
                      </div>
                      <div className="admin-stat-info">
                        <div className="admin-stat-details">
                          <dt className="admin-stat-label">
                            Total Software
                          </dt>
                          <dd className="admin-stat-value">
                            {softwareList.length || 0}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-content">
                    <div className="admin-stat-layout">
                      <div className="admin-stat-icon">
                        <div className="admin-stat-icon-circle admin-stat-icon-yellow">
                          <span className="admin-stat-icon-text">A</span>
                        </div>
                      </div>
                      <div className="admin-stat-info">
                        <div className="admin-stat-details">
                          <dt className="admin-stat-label">
                            Active Sessions
                          </dt>
                          <dd className="admin-stat-value">
                            {dashboardData?.activeSessions || 0}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'software' && (
            <>
              {/* Software Management Header */}
              <div className="admin-software-header">
                <div className="admin-software-info">
                  <h2 className="admin-software-title">Software Management</h2>
                  <p className="admin-software-description">Manage software applications and their access levels</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="admin-add-software-btn"
                >
                  {showAddForm ? 'Cancel' : 'Add New Software'}
                </button>
              </div>

              {/* Add Software Form */}
              {showAddForm && (
                <div className="admin-software-form-container">
                  <SoftwareForm
                    onSoftwareAdded={handleSoftwareAdded}
                    onCancel={() => setShowAddForm(false)}
                  />
                </div>
              )}

              {/* Software List */}
              <SoftwareList
                software={softwareList}
                onSoftwareUpdated={handleSoftwareUpdated}
                onSoftwareDeleted={handleSoftwareDeleted}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;