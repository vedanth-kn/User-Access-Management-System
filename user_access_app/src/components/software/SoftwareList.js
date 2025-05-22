// src/components/software/SoftwareList.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiCallWithAuth } from '../../utils/api';
import SoftwareForm from './SoftwareForm';
import '../../styles/SoftwareList.css';

const SoftwareList = ({ software, onSoftwareUpdated, onSoftwareDeleted }) => {
  const { token } = useAuth();
  const [editingSoftware, setEditingSoftware] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleEdit = (softwareItem) => {
    setEditingSoftware(softwareItem);
  };

  const handleEditCancel = () => {
    setEditingSoftware(null);
  };

  const handleEditComplete = (updatedSoftware) => {
    onSoftwareUpdated(updatedSoftware);
    setEditingSoftware(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this software? This action cannot be undone.')) {
      setDeletingId(id);
      
      const result = await apiCallWithAuth(`/software/${id}`, token, {
        method: 'DELETE'
      });

      if (result.success) {
        onSoftwareDeleted(id);
      } else {
        alert('Failed to delete software. Please try again.');
        console.error('Delete failed:', result.error);
      }
      
      setDeletingId(null);
    }
  };

  const getAccessLevelBadge = (level) => {
    const colors = {
      'Read': 'software-list-badge-green',
      'Write': 'software-list-badge-blue',
      'Admin': 'software-list-badge-red'
    };
    
    return colors[level] || 'software-list-badge-gray';
  };

  if (software.length === 0) {
    return (
      <div className="software-list-empty-card">
        <div className="software-list-empty">
          <svg className="software-list-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="software-list-empty-title">No Software Found</h3>
          <p className="software-list-empty-description">Get started by adding your first software application.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="software-list-container">
      <div className="software-list-header">
        <h3 className="software-list-title">
          Software Applications ({software.length})
        </h3>
        <p className="software-list-subtitle">
          List of all software applications and their access configurations
        </p>
      </div>
      
      <ul className="software-list">
        {software.map((item) => (
          <li key={item.id} className="software-list-item">
            {editingSoftware && editingSoftware.id === item.id ? (
              <SoftwareForm
                software={editingSoftware}
                onSoftwareAdded={handleEditComplete}
                onCancel={handleEditCancel}
                isEditing={true}
              />
            ) : (
              <div className="software-list-item-layout">
                <div className="software-list-item-content">
                  <div className="software-list-item-info">
                    <div className="software-list-item-avatar">
                      <div className="software-list-avatar">
                        <span className="software-list-avatar-text">
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="software-list-item-details">
                      <div className="software-list-item-header">
                        <h4 className="software-list-item-title">
                          {item.name}
                        </h4>
                        <span className="software-list-item-id">
                          ID: {item.id}
                        </span>
                      </div>
                      <p className="software-list-item-description">
                        {item.description}
                      </p>
                      <div className="software-list-badges">
                        {item.accessLevels && item.accessLevels.map((level, index) => (
                          <span
                            key={index}
                            className={`software-list-badge ${getAccessLevelBadge(level)}`}
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="software-list-actions">
                  <button
                    onClick={() => handleEdit(item)}
                    className="software-list-edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className={`software-list-delete-btn ${
                      deletingId === item.id ? 'software-list-delete-btn-disabled' : ''
                    }`}
                  >
                    {deletingId === item.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SoftwareList;