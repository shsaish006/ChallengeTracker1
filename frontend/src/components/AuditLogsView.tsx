import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Calendar, User, Database } from 'lucide-react';

interface AuditLog {
  id?: string;
  challengeId: string;
  action: string;
  timestamp: string;
  details: string;
  performedBy: string;
}

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v6/challenges/audit');
      const result = await response.json();
      if (result.success) {
        setLogs(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch audits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadgeClass = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE':
        return 'badge-create';
      case 'DELETE':
        return 'badge-delete';
      default:
        return 'badge-update';
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div>
      <style>{`
        .timeline-container {
          position: relative;
          padding-left: 32px;
          margin-top: 20px;
        }
        .timeline-line {
          position: absolute;
          left: 7px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(to bottom, var(--accent-blue) 0%, var(--accent-purple) 50%, var(--accent-pink) 100%);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
        }
        .timeline-node {
          position: relative;
          margin-bottom: 32px;
        }
        .timeline-dot {
          position: absolute;
          left: -32px;
          top: 6px;
          width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          border: 3px solid var(--bg-primary);
          z-index: 2;
          box-shadow: 0 0 8px currentColor;
        }
        .timeline-dot.badge-create { background: var(--accent-green); color: var(--accent-green); }
        .timeline-dot.badge-update { background: var(--accent-yellow); color: var(--accent-yellow); }
        .timeline-dot.badge-delete { background: var(--accent-red); color: var(--accent-red); }

        .timeline-card {
          border: 1px solid var(--glass-border);
          transition: var(--transition-smooth);
        }
        .timeline-card:hover {
          transform: translateX(4px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }

        .log-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .log-badge.badge-create { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .log-badge.badge-update { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .log-badge.badge-delete { background: rgba(239, 68, 68, 0.15); color: #f87171; }
      `}</style>

      <div className="glass-panel" style={{ marginBottom: '32px', borderLeft: '4px solid var(--accent-pink)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-pink)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px' }}>
              <ShieldCheck size={24} />
              SYSTEM AUDIT TRAILS (MONGODB NOSQL)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>
              Activity logs capturing challenge updates, creations, and deletion events in real-time. 
              Logs are processed via our custom Express middleware and stored in a NoSQL MongoDB document schema.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchLogs} disabled={loading} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            REFRESH AUDITS
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <RefreshCw size={32} className="spin-anim" style={{ color: 'var(--accent-pink)' }} />
        </div>
      ) : (
        <div className="timeline-container">
          <div className="timeline-line"></div>

          {logs.map((log, idx) => (
            <div key={log.id || idx} className="timeline-node fade-in-up">
              <div className={`timeline-dot ${getActionBadgeClass(log.action)}`}></div>
              
              <div className="glass-panel timeline-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`log-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: '4px' }}>
                      ID: {log.challengeId}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={12} style={{ color: 'var(--accent-pink)' }} />
                    <span>{formatDateTime(log.timestamp)}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'white', fontWeight: 500, marginBottom: '16px', lineHeight: 1.4 }}>
                  {log.details}
                </p>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <User size={12} style={{ color: 'var(--accent-blue)' }} />
                    <span>Actor: {log.performedBy}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Database size={12} style={{ color: 'var(--accent-purple)' }} />
                    <span>Engine: MongoDB NoSQL</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
              No audits have been logged yet. Create, edit, or delete challenges to generate logs.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AuditLogsView;
