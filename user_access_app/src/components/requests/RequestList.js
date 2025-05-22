// src/components/requests/RequestList.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCallWithAuth } from '../../utils/api';
import '../../styles/RequestList.css';

const RequestList = ({ refreshTrigger, endpoint = '/requests/my-requests', showTitle = true, compact = false }) => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      
      try {
        const result = await apiCallWithAuth(endpoint, token);
        
        if (result.success) {
          setRequests(result.data || []);
        } else {
          console.error('Failed to fetch requests:', result);
          setError('Failed to load requests');
          setRequests([]);
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('An error occurred while loading requests');
        setRequests([]);
      }
      
      setLoading(false);
    };

    if (token) {
      fetchRequests();
    }
  }, [token, refreshTrigger, endpoint]);

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': compact ? 'employee-badge-yellow' : 'request-list-badge-yellow',
      'Approved': compact ? 'employee-badge-green' : 'request-list-badge-green',
      'Rejected': compact ? 'employee-badge-red' : 'request-list-badge-red'
    };
    
    return colors[status] || (compact ? 'employee-badge-gray' : 'request-list-badge-gray');
  };

  const getAccessTypeBadge = (accessType) => {
    const colors = {
      'Read': compact ? 'employee-badge-blue' : 'request-list-badge-blue',
      'Write': compact ? 'employee-badge-purple' : 'request-list-badge-purple',
      'Admin': compact ? 'employee-badge-red' : 'request-list-badge-red'
    };
    
    return colors[accessType] || (compact ? 'employee-badge-gray' : 'request-list-badge-gray');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    if (compact) {
      return (
        <div className="employee-card">
          <div className="employee-loading-content">
            <div className="employee-spinner"></div>
            <p className="employee-loading-text">Loading requests...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (compact) {
      return (
        <div className="request-list-empty-state">
          <div className="request-list-empty-content">
            <svg className="request-list-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="request-list-empty-title">Error Loading Requests</h3>
            <p className="request-list-empty-description">{error}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="request-list-container">
        <div className="request-list-error">
          <svg className="request-list-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="request-list-error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    const emptyMessage = endpoint.includes('pending') 
      ? "You don't have any pending access requests."
      : "You haven't submitted any access requests yet.";
    
    const emptyTitle = endpoint.includes('pending') 
      ? "No Pending Requests"
      : "No Requests Found";

    if (compact) {
      return (
        <div className="request-list-empty-state">
          <div className="request-list-empty-content">
            <svg className="request-list-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="request-list-empty-title">{emptyTitle}</h3>
            <p className="request-list-empty-description">{emptyMessage}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="request-list-container">
        <div className="request-list-empty-state">
          <svg className="request-list-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="request-list-empty-title">{emptyTitle}</h3>
          <p className="request-list-empty-description">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Compact version for dashboard
  if (compact) {
    return (
      <ul className="employee-list">
        {requests.map((request) => (
          <li key={request.id} className="employee-list-item">
            <div className="employee-item-layout">
              <div className="employee-item-content">
                <div className="employee-item-icon">
                  <div className="employee-request-avatar">
                    <span className="employee-avatar-text">
                      {request.software?.name?.charAt(0).toUpperCase() || 'S'}
                    </span>
                  </div>
                </div>
                <div className="employee-item-info">
                  <h4 className="employee-item-title">
                    {request.software?.name || `Software ID: ${request.softwareId}`}
                  </h4>
                  <div className="employee-badge-container">
                    <span className={`employee-badge ${getAccessTypeBadge(request.accessType)}`}>
                      {request.accessType} Access
                    </span>
                  </div>
                  <p className="employee-request-reason">
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p className="employee-request-date">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="employee-status-container">
                <span className={`employee-status-badge ${getStatusBadge(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // Full version for history view
  return (
    <div className="request-list-full-container">
      {showTitle && (
        <div className="request-list-header">
          <h3 className="request-list-title">
            My Access Requests ({requests.length})
          </h3>
          <p className="request-list-subtitle">
            Track the status of your software access requests
          </p>
        </div>
      )}
      
      <ul className={`request-list-items ${showTitle ? 'request-list-with-border' : ''}`}>
        {requests.map((request) => (
          <li key={request.id} className="request-list-item">
            <div className="request-list-item-layout">
              <div className="request-list-item-content">
                <div className="request-list-avatar-container">
                  <div className="request-list-avatar">
                    <span className="request-list-avatar-text">
                      {request.software?.name?.charAt(0).toUpperCase() || 'S'}
                    </span>
                  </div>
                </div>
                <div className="request-list-details">
                  <div className="request-list-info">
                    <div className="request-list-main-info">
                      <h4 className="request-list-software-name">
                        {request.software?.name || `Software ID: ${request.softwareId}`}
                      </h4>
                      <div className="request-list-badges">
                        <span className={`request-list-badge ${getAccessTypeBadge(request.accessType)}`}>
                          {request.accessType} Access
                        </span>
                        <span className={`request-list-badge ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="request-list-reason">
                        <strong>Reason:</strong> {request.reason}
                      </p>
                      <p className="request-list-date">
                        Submitted: {formatDate(request.createdAt)}
                      </p>
                      {request.updatedAt && request.updatedAt !== request.createdAt && (
                        <p className="request-list-date">
                          Updated: {formatDate(request.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="request-list-status-container">
                {request.status === 'Pending' && (
                  <div className="request-list-status-indicator request-list-status-pending">
                    <svg className="request-list-status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="request-list-status-text">Awaiting Review</span>
                  </div>
                )}
                {request.status === 'Approved' && (
                  <div className="request-list-status-indicator request-list-status-approved">
                    <svg className="request-list-status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="request-list-status-text">Approved</span>
                  </div>
                )}
                {request.status === 'Rejected' && (
                  <div className="request-list-status-indicator request-list-status-rejected">
                    <svg className="request-list-status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="request-list-status-text">Rejected</span>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestList;