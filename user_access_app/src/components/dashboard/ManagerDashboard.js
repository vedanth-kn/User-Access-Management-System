import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { apiCallWithAuth } from '../../utils/api';
import '../../styles/ManagerDashboard.css'; // Import the custom styles

const ManagerDashboard = () => {
  const { user, token, logout } = useAuth();
  const { navigate } = useRouter();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      try {
        const result = await apiCallWithAuth('/requests/pending', token, 'GET');
        if (result.success) {
          setPendingRequests(result.data || []);
        } else {
          const fallbackResult = await apiCallWithAuth('/requests', token, 'GET');
          if (fallbackResult.success) {
            const pending = (fallbackResult.data || []).filter(request =>
              request.status.toLowerCase() === 'pending'
            );
            setPendingRequests(pending);
          } else {
            setPendingRequests([]);
          }
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        setPendingRequests([]);
      }
      setLoading(false);
    };

    if (token) fetchPendingRequests();
  }, [token, refreshTrigger]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRequestAction = async (requestId, action) => {
    setActionLoading(requestId);
    try {
      const result = await apiCallWithAuth(`/requests/${requestId}`, token, 'PATCH', {
        status: action
      });

      if (result.success) {
        setRefreshTrigger(prev => prev + 1);
        alert(`Request ${action.toLowerCase()} successfully!`);
      } else {
        alert(`Failed to ${action.toLowerCase()} request: ${result.error || result.data?.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error ${action.toLowerCase()} request: ${err.message || 'Network error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const normalized = status.toLowerCase();
    if (normalized === 'pending') return 'badge-pending';
    if (normalized === 'approved') return 'badge-approved';
    if (normalized === 'rejected') return 'badge-rejected';
    return 'badge-default';
  };

  const getAccessTypeBadge = (accessType) => {
    const normalized = accessType.toLowerCase();
    if (normalized === 'read') return 'badge-read';
    if (normalized === 'write') return 'badge-write';
    if (normalized === 'admin') return 'badge-admin';
    return 'badge-default';
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Navigation */}
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">Manager Dashboard</h1>
          <div className="navbar-user-info">
            <span className="welcome-text">Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <section className="dashboard-header">
          <h2 className="dashboard-heading">Pending Access Requests</h2>
          <p className="dashboard-subheading">Review and approve or reject employee access requests</p>
        </section>

        <section className="dashboard-content">
          <div className="dashboard-card">
            <header className="card-header">
              <h3 className="card-title">
                Requests Awaiting Review ({pendingRequests.length})
              </h3>
              <p className="card-description">Click Approve or Reject to process each request</p>
            </header>

            {pendingRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✔</div>
                <h3 className="empty-title">No Pending Requests</h3>
                <p className="empty-description">All access requests have been processed.</p>
              </div>
            ) : (
              <ul className="request-list">
                {pendingRequests.map((request) => (
                  <li key={request.id} className="request-item">
                    <div className="request-details">
                      <div className="software-icon">
                        {request.software?.name?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div className="request-info">
                        <h4 className="software-name">
                          {request.software?.name || `Software ID: ${request.softwareId}`}
                        </h4>
                        <div className="request-badges">
                          <span className={`badge ${getAccessTypeBadge(request.accessType)}`}>
                            {request.accessType} Access
                          </span>
                          <span className={`badge ${getStatusBadge(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="employee-info">
                          <strong>Employee:</strong> {request.user?.username || request.userName || 'Unknown'}
                        </p>
                        <p className="reason-info">
                          <strong>Reason:</strong> {request.reason}
                        </p>
                        <p className="submitted-date">
                          Submitted: {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        onClick={() => handleRequestAction(request.id, 'Approved')}
                        disabled={actionLoading === request.id}
                        className="approve-button"
                      >
                        {actionLoading === request.id ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'Rejected')}
                        disabled={actionLoading === request.id}
                        className="reject-button"
                      >
                        {actionLoading === request.id ? '...' : 'Reject'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;
