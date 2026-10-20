
import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminGrievances.css';

const API = 'http://localhost:5000/api/grievances/admin';

const AdminGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [adminComments, setAdminComments] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGrievances = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response received from server.');
      }

      setGrievances(data);
    } catch (err) {
      console.error('Error fetching grievances:', err);
      setError(err.message || 'Unable to load grievances.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleStatusUpdate = async (grievanceId, newStatus) => {
    try {
      const response = await fetch(`${API}/${grievanceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminComments: adminComments.trim()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update grievance.');
      }

      const updatedGrievance = result.grievance || result;

      if (!updatedGrievance._id) {
        await fetchGrievances();
      } else {
        setGrievances((previous) =>
          previous.map((item) =>
            item._id === grievanceId ? updatedGrievance : item
          )
        );
      }

      setSelectedGrievance(null);
      setAdminComments('');
      alert(`Grievance updated to "${newStatus}".`);
      await fetchGrievances();
    } catch (err) {
      console.error('Error updating grievance:', err);
      alert(`Could not update grievance: ${err.message}`);
    }
  };

  const filteredGrievances = grievances.filter((grievance) => {
    if (filter === 'all') return true;
    return (grievance.status || '').toLowerCase() === filter;
  });

  const stats = {
    total: grievances.length,
    pending: grievances.filter(
      (g) => (g.status || '').toLowerCase() === 'pending'
    ).length,
    inProgress: grievances.filter(
      (g) => (g.status || '').toLowerCase() === 'in progress'
    ).length,
    resolved: grievances.filter(
      (g) => (g.status || '').toLowerCase() === 'resolved'
    ).length
  };

  const priorityClass = (priority) => {
    switch ((priority || 'medium').toLowerCase()) {
      case 'high': return 'priority-high';
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      default: return 'priority-default';
    }
  };

  const statusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'resolved': return 'status-resolved';
      case 'in progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  return (
    <div className="admin-grievances">
      <section className="hero-section">
        <div className="container">
          <Link to="/admin/admindashboard" className="back-link">
            <ArrowLeft className="btn-icon" />
            Back to Admin Dashboard
          </Link>

          <div className="hero-content">
            <h1 className="hero-title">Manage Grievances</h1>
            <p className="hero-subtitle">
              Review citizen complaints, track their progress and update
              their status.
            </p>
          </div>
        </div>
      </section>

      <section className="main-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <FileText className="stat-icon blue" />
                <div className="stat-number">{stats.total}</div>
                <p className="stat-label">Total Grievances</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <AlertCircle className="stat-icon red" />
                <div className="stat-number">{stats.pending}</div>
                <p className="stat-label">Pending</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <Clock className="stat-icon yellow" />
                <div className="stat-number">{stats.inProgress}</div>
                <p className="stat-label">In Progress</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-content">
                <CheckCircle className="stat-icon green" />
                <div className="stat-number">{stats.resolved}</div>
                <p className="stat-label">Resolved</p>
              </div>
            </div>
          </div>

          <div className="filter-buttons">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'in progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={`filter-btn ${filter === item.value ? 'active' : ''}`}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              className="filter-btn"
              onClick={fetchGrievances}
              disabled={loading}
            >
              <RefreshCw className="btn-icon" />
              Refresh
            </button>
          </div>

          <div className="table-card">
            <div className="card-header">
              <h2 className="card-title">Submitted Grievances</h2>
              <p className="card-description">
                Review and manage complaints submitted by citizens.
              </p>
            </div>

            <div className="card-content">
              {loading ? (
                <div className="empty-state">
                  <p className="empty-text">Loading grievances...</p>
                </div>
              ) : error ? (
                <div className="empty-state">
                  <AlertCircle className="empty-icon" />
                  <p className="empty-text">{error}</p>
                  <button
                    type="button"
                    className="filter-btn"
                    onClick={fetchGrievances}
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredGrievances.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle className="empty-icon" />
                  <p className="empty-text">
                    No grievances found for this filter.
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="grievances-table">
                    <thead>
                      <tr>
                        <th>Grievance ID</th>
                        <th>Category</th>
                        <th>Phone</th>
                        <th>Priority</th>
                        <th>Submitted Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredGrievances.map((grievance) => (
                        <tr key={grievance._id}>
                          <td className="font-medium">
                            {grievance._id}
                          </td>
                          <td>{grievance.category || 'General'}</td>
                          <td>{grievance.phone || 'Not provided'}</td>
                          <td>
                            <span className={`badge ${priorityClass(grievance.priority)}`}>
                              {(grievance.priority || 'medium').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {grievance.submittedAt
                              ? new Date(grievance.submittedAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                          <td>
                            <span className={`badge ${statusClass(grievance.status)}`}>
                              {grievance.status || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="review-btn"
                              onClick={() => {
                                setSelectedGrievance(grievance);
                                setAdminComments(grievance.adminComments || '');
                              }}
                            >
                              <Eye className="btn-icon" />
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedGrievance && (
        <div
          className="modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedGrievance(null);
            }
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <h2 className="modal-title">
                Review Grievance
              </h2>
              <p className="modal-description">
                ID: {selectedGrievance._id}
              </p>
            </div>

            <div className="modal-content">
              <div className="details-grid">
                <div className="details-section">
                  <h4 className="section-title">Citizen Details</h4>
                  <div className="details-list">
                    <p>
                      <span className="detail-label">Name: </span>
                      {selectedGrievance.name || 'Not provided'}
                    </p>
                    <p>
                      <span className="detail-label">Phone: </span>
                      {selectedGrievance.phone || 'Not provided'}
                    </p>
                    <p>
                      <span className="detail-label">Email: </span>
                      {selectedGrievance.email || 'Not provided'}
                    </p>
                    <p>
                      <span className="detail-label">Address: </span>
                      {selectedGrievance.address || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="details-section">
                  <h4 className="section-title">Grievance Details</h4>
                  <div className="details-list">
                    <p>
                      <span className="detail-label">Category: </span>
                      {selectedGrievance.category || 'General'}
                    </p>
                    <p>
                      <span className="detail-label">Priority: </span>
                      {selectedGrievance.priority || 'Medium'}
                    </p>
                    <p>
                      <span className="detail-label">Submitted: </span>
                      {selectedGrievance.submittedAt
                        ? new Date(selectedGrievance.submittedAt).toLocaleString()
                        : 'N/A'}
                    </p>
                    <p>
                      <span className="detail-label">Status: </span>
                      {selectedGrievance.status || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="description-section">
                <h4 className="section-title">Complaint Description</h4>
                <p className="description-text">
                  {selectedGrievance.description || 'No description provided.'}
                </p>
              </div>

              {selectedGrievance.attachments?.length > 0 && (
                <div className="description-section">
                  <h4 className="section-title">Attachments</h4>
                  {selectedGrievance.attachments.map((attachment, index) => (
                    <p key={index} className="description-text">
                      {typeof attachment === 'string'
                        ? attachment
                        : attachment.filename || attachment.name || 'Attachment'}
                    </p>
                  ))}
                </div>
              )}

              <div className="action-section">
                <div className="textarea-container">
                  <label className="textarea-label">
                    Admin Comments / Response
                  </label>
                  <textarea
                    className="admin-textarea"
                    value={adminComments}
                    onChange={(event) => setAdminComments(event.target.value)}
                    placeholder="Enter an update or response for the citizen..."
                    rows={4}
                  />
                </div>

                <div className="action-buttons">
                  {selectedGrievance.status !== 'Resolved' && (
                    <>
                      {selectedGrievance.status !== 'In Progress' && (
                        <button
                          type="button"
                          className="action-btn progress-btn"
                          onClick={() =>
                            handleStatusUpdate(selectedGrievance._id, 'In Progress')
                          }
                        >
                          <Clock className="btn-icon" />
                          Accept / In Progress
                        </button>
                      )}

                      <button
                        type="button"
                        className="action-btn resolve-btn"
                        onClick={() =>
                          handleStatusUpdate(selectedGrievance._id, 'Resolved')
                        }
                      >
                        <CheckCircle className="btn-icon" />
                        Mark Resolved
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    className="action-btn comment-btn"
                    onClick={() =>
                      handleStatusUpdate(
                        selectedGrievance._id,
                        selectedGrievance.status || 'Pending'
                      )
                    }
                  >
                    <MessageSquare className="btn-icon" />
                    Save Comment
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setSelectedGrievance(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGrievances;
