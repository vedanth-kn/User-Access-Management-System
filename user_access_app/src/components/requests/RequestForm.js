// src/components/requests/RequestForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCallWithAuth } from '../../utils/api';
import '../../styles/RequestForm.css';

const RequestForm = ({ onRequestSubmitted, onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    softwareId: '',
    accessType: '',
    reason: ''
  });
  const [softwareList, setSoftwareList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingSoftware, setLoadingSoftware] = useState(true);

  const accessTypes = [
    { value: 'Read', label: 'Read - View only access' },
    { value: 'Write', label: 'Write - Create and edit access' },
    { value: 'Admin', label: 'Admin - Full administrative access' }
  ];

  useEffect(() => {
    const fetchSoftware = async () => {
      setLoadingSoftware(true);
      try {
        const result = await apiCallWithAuth('/software', token);
        if (result.success) {
          setSoftwareList(result.data || []);
        } else {
          console.error('Failed to fetch software list:', result);
          setError('Failed to load software options');
        }
      } catch (err) {
        console.error('Error fetching software:', err);
        setError('Error loading software options');
      }
      setLoadingSoftware(false);
    };

    if (token) {
      fetchSoftware();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.softwareId) {
      setError('Please select a software');
      setLoading(false);
      return;
    }

    if (!formData.accessType) {
      setError('Please select an access type');
      setLoading(false);
      return;
    }

    if (!formData.reason.trim()) {
      setError('Please provide a reason for this request');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        softwareId: parseInt(formData.softwareId),
        accessType: formData.accessType,
        reason: formData.reason.trim()
      };

      console.log('Submitting request:', requestData);

      const result = await apiCallWithAuth('/requests', token, 'POST', requestData);

      console.log('Request submission result:', result);

      if (result.success) {
        // Reset form
        setFormData({
          softwareId: '',
          accessType: '',
          reason: ''
        });
        
        // Notify parent component
        if (onRequestSubmitted) {
          onRequestSubmitted(result.data.request || result.data);
        }
      } else {
        const errorMessage = result.data?.message || 
                           result.error || 
                           'Failed to submit request';
        setError(errorMessage);
        console.error('Request submission error:', result);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Request form error:', err);
    }

    setLoading(false);
  };

  const selectedSoftware = softwareList.find(s => s.id === parseInt(formData.softwareId));

  return (
    <div className="request-form-card">
      <div className="request-form-header">
        <h3 className="request-form-title">
          Request Software Access
        </h3>
        <p className="request-form-subtitle">
          Submit a request to gain access to software applications
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="request-form-content">
        {error && (
          <div className="request-form-error">
            <div className="request-form-error-layout">
              <div className="request-form-error-icon">
                <svg className="request-form-error-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="request-form-error-message">
                <p className="request-form-error-text">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="request-form-fields">
          {/* Software Selection */}
          <div className="request-form-field">
            <label htmlFor="softwareId" className="request-form-label">
              Software <span className="request-form-required">*</span>
            </label>
            {loadingSoftware ? (
              <div className="request-form-loading">Loading software options...</div>
            ) : (
              <select
                id="softwareId"
                name="softwareId"
                value={formData.softwareId}
                onChange={handleChange}
                className="request-form-select"
                required
                disabled={loading}
              >
                <option value="">Select a software...</option>
                {softwareList.map((software) => (
                  <option key={software.id} value={software.id}>
                    {software.name}
                  </option>
                ))}
              </select>
            )}
            {selectedSoftware && (
              <p className="request-form-description">
                {selectedSoftware.description}
              </p>
            )}
          </div>

          {/* Access Type Selection */}
          <div className="request-form-field">
            <label htmlFor="accessType" className="request-form-label">
              Access Type <span className="request-form-required">*</span>
            </label>
            <select
              id="accessType"
              name="accessType"
              value={formData.accessType}
              onChange={handleChange}
              className="request-form-select"
              required
              disabled={loading}
            >
              <option value="">Select access type...</option>
              {accessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div className="request-form-field">
            <label htmlFor="reason" className="request-form-label">
              Reason for Request <span className="request-form-required">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please explain why you need access to this software and how you plan to use it..."
              className="request-form-textarea"
              required
              disabled={loading}
            />
            <p className="request-form-help">
              Provide a clear business justification for your request
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="request-form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="request-form-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || loadingSoftware}
            className={`request-form-submit-btn ${
              loading || loadingSoftware
                ? 'request-form-submit-btn-disabled'
                : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;