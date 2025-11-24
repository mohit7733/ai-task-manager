import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import '../App.css';

const MyStandups = () => {
  const [standups, setStandups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandups();
  }, []);

  const fetchStandups = async () => {
    try {
      const res = await api.get('/api/standups/my-standups');
      setStandups(res.data);
    } catch (error) {
      toast.error('Failed to fetch standups');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page">
          <div className="panel">
            <div className="loading">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="panel">
          <h1 className="page-title" style={{ marginBottom: 12 }}>📊 My Standup History</h1>
          <p className="page-subtitle" style={{ marginBottom: 24 }}>
            A record of everything you've shared with the team.
          </p>

          {standups.length === 0 ? (
            <div className="empty-state">
              <h3>No standups yet</h3>
              <p>Submit your first update from the dashboard.</p>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 15,
              }}
            >
              {standups.map((standup) => (
                <>
                  <div
                    key={standup._id}
                    className="standup-card"
                    style={{
                      background: 'var(--panel-bg)',
                      borderRadius: 14,
                      boxShadow: '0 2px 12px 0 rgba(10,20,60,.04)',
                      padding: '24px 20px 18px 20px',
                      marginBottom: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 18,
                      border: '1px solid var(--border-color, #ececec)',
                      transition: 'box-shadow 0.13s',
                      flex: '0 0 calc(25% - 15px)',
                    }}
                  >
                    <div
                      className="standup-header"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                        paddingBottom: 10,
                        borderBottom: '1px solid #ececec',
                      }}
                    >
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: 0.2 }}>
                          {format(new Date(standup.date), 'MMM d, yyyy')}
                        </h3>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          {format(new Date(standup.date), 'h:mm a')}
                        </span>
                      </div>
                      <span
                        className="chip chip-success"
                        style={{
                          fontSize: 12,
                          background: 'var(--success-bg, #c0f4de)',
                          color: 'var(--success-text, #207d5e)',
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontWeight: 500,
                          letterSpacing: 0.15,
                        }}
                      >
                        Submitted
                      </span>
                    </div>

                    <div className="standup-section" style={{ marginBottom: 4 }}>
                      <div style={{ fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 17 }}>✅</span> Completed Yesterday
                      </div>
                      <p style={{
                        color: 'var(--text-muted)',
                        marginTop: 4,
                        whiteSpace: 'pre-line',
                        fontSize: 14,
                      }} title={standup.completedYesterday}>{standup.completedYesterday}</p>
                    </div>

                    <div className="standup-section" style={{ marginBottom: 4 }}>
                      <div style={{ fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 17 }}>🎯</span> Plan Today
                      </div>
                      <p style={{
                        color: 'var(--text-muted)',
                        marginTop: 4,
                        whiteSpace: 'pre-line',
                        fontSize: 14,
                      }} title={standup.planToday}>{standup.planToday}</p>
                    </div>

                    <div className="standup-section">
                      <div style={{ fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 17 }}>🚧</span> Blockers
                      </div>
                      <p style={{
                        color: 'var(--text-muted)',
                        marginTop: 4,
                        whiteSpace: 'pre-line',
                        fontSize: 14,
                        fontStyle: !standup.blockers ? 'italic' : undefined,
                      }}>{standup.blockers || 'None'}</p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyStandups;

