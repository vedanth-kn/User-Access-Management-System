// src/components/software/SoftwareForm.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/SoftwareForm.css';

const SoftwareForm = ({ software, onSoftwareAdded, onCancel, isEditing = false }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: software?.name || '',
    description: software?.description || '',
    accessLevels: software?.accessLevels || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableAccessLevels = ['Read', 'Write', 'Admin'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleAccessLevelChange = (level) => {
    setFormData(prev => ({
      ...prev,
      accessLevels: prev.accessLevels.includes(level)
        ? prev.accessLevels.filter(l => l !== level)
        : [...prev.accessLevels, level]
    }));
    // Clear error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError('Software name is required');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      setLoading(false);
      return;
    }

    if (formData.accessLevels.length === 0) {
      setError('Please select at least one access level');
      setLoading(false);
      return;
    }

    try {
      // Direct fetch approach
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const endpoint = isEditing ? `${baseUrl}/software/${software.id}` : `${baseUrl}/software`;
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Submitting to:', endpoint, 'with method:', method);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('API response:', result);

      if (response.ok && result.success) {
        const softwareData = result.data?.software || result.data;
        
        // Call the callback to update the parent component
        onSoftwareAdded(softwareData);
        
        // Reset form only if creating new software (not editing)
        if (!isEditing) {
          setFormData({
            name: '',
            description: '',
            accessLevels: []
          });
        }
        
        // Close the form by calling onCancel (which should hide the form)
        if (onCancel) {
          onCancel();
        }
        
      } else {
        const errorMessage = result.message || 
                           result.error || 
                           `Failed to ${isEditing ? 'update' : 'create'} software`;
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Software form error:', err);
      
      // More specific error messages
      if (err.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else if (err.message.includes('Failed to execute')) {
        setError('Request failed: Please check the server URL and try again.');
      } else {
        setError(`Network error: ${err.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="software-form-card">
      <div className="software-form-header">
        <h3 className="software-form-title">
          {isEditing ? 'Edit Software' : 'Add New Software'}
        </h3>
        <p className="software-form-subtitle">
          {isEditing ? 'Update software information and access levels' : 'Create a new software application with access control'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="software-form-content">
        {error && (
          <div className="software-form-error">
            <div className="software-form-error-layout">
              <div className="software-form-error-icon">
                <svg className="software-form-error-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="software-form-error-message">
                <p className="software-form-error-text">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="software-form-fields">
          {/* Software Name */}
          <div className="software-form-field">
            <label htmlFor="name" className="software-form-label">
              Software Name <span className="software-form-required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Photoshop, Microsoft Office, Slack"
              className="software-form-input"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="software-form-field">
            <label htmlFor="description" className="software-form-label">
              Description <span className="software-form-required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the software and its purpose"
              className="software-form-textarea"
              required
              disabled={loading}
            />
          </div>

          {/* Access Levels */}
          <div className="software-form-field">
            <label className="software-form-label software-form-checkbox-group-label">
              Access Levels <span className="software-form-required">*</span>
            </label>
            <div className="software-form-checkbox-group">
              {availableAccessLevels.map((level) => (
                <div key={level} className="software-form-checkbox-item">
                  <div className="software-form-checkbox-wrapper">
                    <input
                      id={`access-${level}`}
                      type="checkbox"
                      checked={formData.accessLevels.includes(level)}
                      onChange={() => handleAccessLevelChange(level)}
                      disabled={loading}
                      className="software-form-checkbox"
                    />
                  </div>
                  <div className="software-form-checkbox-content">
                    <label htmlFor={`access-${level}`} className="software-form-checkbox-label">
                      {level}
                    </label>
                    <p className="software-form-checkbox-description">
                      {level === 'Read' && 'View only access'}
                      {level === 'Write' && 'Create and edit access'}
                      {level === 'Admin' && 'Full administrative access'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="software-form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="software-form-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`software-form-submit-btn ${
              loading ? 'software-form-submit-btn-disabled' : ''
            }`}
          >
            {loading 
              ? `${isEditing ? 'Updating' : 'Creating'}...` 
              : `${isEditing ? 'Update' : 'Create'} Software`
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoftwareForm;