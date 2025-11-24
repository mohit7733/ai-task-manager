import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import '../App.css';

const TeamView = () => {
  const [standups, setStandups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchTeamStandups();
    }
  }, [selectedDate, selectedTeam]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
      const teams = [...new Set(res.data.map(u => u.team))];
      if (teams.length > 0 && !selectedTeam) {
        setSelectedTeam(teams[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    }
  };

  const fetchTeamStandups = async () => {
    setLoading(true);
    try {
      const params = { date: selectedDate };
      if (selectedTeam) {
        params.team = selectedTeam;
      }
      const res = await api.get('/api/standups/team', { params });
      setStandups(res.data);
    } catch (error) {
      toast.error('Failed to fetch team standups');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const teams = [...new Set(users.map(u => u.team))];
  const submittedUsers = standups.map(s => s.user._id.toString());
  const missingUsers = users.filter(u =>
    (!selectedTeam || u.team === selectedTeam) &&
    !submittedUsers.includes(u._id.toString())
  );

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="panel">
          <h1 className="page-title" style={{ marginBottom: 12 }}>
            👥 Team Standup View
          </h1>
          <p className="page-subtitle" style={{ marginBottom: 24 }}>
            Track which teammates have submitted updates and spot blockers quickly.
          </p>

          <div className="filters-grid" style={{ marginBottom: 24 }}>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Team</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">All teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="stat-grid" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                  <span className="stat-label">Standups submitted</span>
                  <span className="stat-value">{standups.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Missing standups</span>
                  <span className="stat-value">{missingUsers.length}</span>
                </div>
              </div>

              {missingUsers.length > 0 && (
                <div className="panel" style={{ borderColor: 'rgba(251, 191, 36, 0.35)', background: 'rgba(251, 191, 36, 0.08)', marginBottom: 24 }}>
                  <h3 style={{ color: 'var(--warning)', marginBottom: 12 }}>⚠️ Still pending</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {missingUsers.map(user => (
                      <span key={user._id} className="badge badge-member" style={{ fontSize: 13 }}>
                        {user.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {standups.length === 0 ? (
                <div className="empty-state">
                  <h3>No standups found for this date</h3>
                  <p>No team members have submitted standups for {format(new Date(selectedDate), 'MMMM d, yyyy')}.</p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 20,
                  }}
                >
                  {standups.map((standup) => (
                    <div
                      key={standup._id}
                      className="standup-card"
                      style={{
                        background: 'var(--panel-bg)',
                        borderRadius: 14,
                        boxShadow: '0 2px 12px 0 rgba(10,20,60,.05)',
                        padding: '24px 20px 18px 20px',
                        marginBottom: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 18,
                        border: '1px solid var(--border-color, #ececec)',
                        transition: 'box-shadow 0.13s',
                        flex: '0 0 calc(25% - 20px)',
                        minWidth: 260,
                        maxWidth: 350,
                      }}
                    >
                      <span
                        className={` chip-${standup.user.role}`}
                        style={{
                          fontSize: 12,
                          background: 'var(--primary-bg, #e5ecff)',
                          color: 'var(--primary-text, #223fa4)',
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontWeight: 500,
                          letterSpacing: 0.15,
                          textTransform: 'capitalize',
                          textAlign: 'center'
                        }}
                      >
                        {standup.user.role}
                      </span>
                      <div
                        className="standup-header"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                          paddingBottom: 10,
                          borderBottom: '1px solid #ececec',
                          gap: 12,
                        }}
                      >

                        <div>
                          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: 0.2 }}>
                            {standup.user.name}
                          </h3>
                          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            {standup.user.team ? `${standup.user.team} • ` : ''}
                            {standup.user.email}
                          </span>
                        </div>

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
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }} title={standup.planToday}>{standup.planToday}</p>
                      </div>

                      <div className="standup-section">
                        <div style={{ fontWeight: 500, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 17 }}>🚧</span> Blockers
                        </div>
                        <p
                          style={{
                            color:
                              standup.blockers && standup.blockers.toLowerCase() !== 'none'
                                ? 'var(--danger)'
                                : 'var(--text-muted)',
                            marginTop: 4,
                            whiteSpace: 'pre-line',
                            fontSize: 14,
                            fontStyle: !standup.blockers ? 'italic' : undefined,
                          }}
                        >
                          {standup.blockers || 'None'}
                        </p>
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                        Submitted: {format(new Date(standup.createdAt), 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamView;

