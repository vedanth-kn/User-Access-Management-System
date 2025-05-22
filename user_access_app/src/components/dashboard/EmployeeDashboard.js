// src/components/dashboard/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { apiCallWithAuth } from '../../utils/api';
import RequestForm from '../requests/RequestForm';
import RequestList from '../requests/RequestList';
import '../../styles/EmployeeDashboard.css'

const EmployeeDashboard = () => {
  const { user, token, logout } = useAuth();
  const { navigate } = useRouter();
  const [softwareList, setSoftwareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch software list
        const softwareResult = await apiCallWithAuth('/software', token, 'GET');
        if (softwareResult.success) {
          setSoftwareList(softwareResult.data || []);
        } else {
          console.error('Failed to fetch software:', softwareResult);
          setError('Unable to load software list. Please try again later.');
          setSoftwareList([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while loading data. Please try again later.');
        setSoftwareList([]);
      }
      
      setLoading(false);
    };

    if (token && user?.id) {
      fetchData();
    }
  }, [token, user?.id, refreshTrigger]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRequestSubmitted = () => {
    setShowRequestForm(false);
    setRefreshTrigger(prev => prev + 1);
    alert('Request submitted successfully!');
  };

  if (loading) {
    return (
      <div className="employee-loading-screen">
        <div className="employee-loading-content">
          <div className="employee-spinner"></div>
          <p className="employee-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard-container">
      {/* Navigation */}
      <nav className="employee-navbar">
        <div className="employee-navbar-content">
          <div className="employee-navbar-inner">
            <div className="employee-navbar-brand">
              <h1 className="employee-navbar-title">Employee Dashboard</h1>
            </div>
            <div className="employee-navbar-actions">
              <span className="employee-welcome-text">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="employee-logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="employee-main-content">
        <div className="employee-content-wrapper">
          {/* Error Message */}
          {error && (
            <div className="employee-error-container">
              <div className="employee-error-layout">
                <div className="employee-error-icon">
                  <svg className="employee-error-svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="employee-error-message">
                  <p className="employee-error-text">{error}</p>
                </div>
                <div className="employee-error-actions">
                  <button
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="employee-error-retry-btn"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Request Form */}
          {showRequestForm && (
            <div className="employee-request-form-container">
              <RequestForm
                onRequestSubmitted={handleRequestSubmitted}
                onCancel={() => setShowRequestForm(false)}
              />
            </div>
          )}

          {/* Request History using RequestList Component */}
          {showHistory && (
            <div className="employee-history-container">
              <div className="employee-section-header">
                <div className="employee-section-info">
                  <h2 className="employee-section-title">Request History</h2>
                  <p className="employee-section-description">View all your access requests</p>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="employee-close-btn"
                >
                  <svg className="employee-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close History
                </button>
              </div>
              <RequestList 
                refreshTrigger={refreshTrigger} 
                endpoint="/requests/my-requests"
                showTitle={true}
                compact={false}
              />
            </div>
          )}

          {/* Available Software Section */}
          <div className="employee-software-section">
            <div className="employee-section-header">
              <div className="employee-section-info">
                <h2 className="employee-section-title">Available Software</h2>
                <p className="employee-section-description">Software applications you have access to</p>
              </div>
              <div className="employee-header-actions">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="employee-history-btn"
                >
                  <svg className="employee-history-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {showHistory ? 'Hide History' : 'View History'}
                </button>
                <button
                  onClick={() => setShowRequestForm(!showRequestForm)}
                  className="employee-request-btn"
                >
                  <svg className="employee-request-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {showRequestForm ? 'Cancel Request' : 'Request Access'}
                </button>
              </div>
            </div>

            <div className="employee-card">
              <div className="employee-card-header">
                <h3 className="employee-card-title">
                  Software Access ({softwareList.length})
                </h3>
              </div>
              
              {softwareList.length === 0 ? (
                <div className="employee-empty-state">
                  <div className="employee-empty-content">
                    <svg className="employee-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="employee-empty-title">No Software Available</h3>
                    <p className="employee-empty-description">You don't currently have access to any software applications.</p>
                  </div>
                </div>
              ) : (
                <ul className="employee-list">
                  {softwareList.map((software) => (
                    <li key={software.id} className="employee-list-item">
                      <div className="employee-item-layout">
                        <div className="employee-item-content">
                          <div className="employee-item-icon">
                            <div className="employee-software-avatar">
                              <span className="employee-avatar-text">
                                {software.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="employee-item-info">
                            <h4 className="employee-item-title">
                              {software.name}
                            </h4>
                            <p className="employee-item-description">
                              {software.description}
                            </p>
                          </div>
                        </div>
                        <button className="employee-launch-btn">
                          Launch
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Pending Requests Section using RequestList Component */}
          <div className="employee-card">
            <div className="employee-card-header">
              <h3 className="employee-card-title">
                Pending Requests
              </h3>
              <p className="employee-card-subtitle">
                Requests currently awaiting approval
              </p>
            </div>
            
            <RequestList 
              refreshTrigger={refreshTrigger} 
              endpoint="/requests/my-pending"
              showTitle={false}
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;