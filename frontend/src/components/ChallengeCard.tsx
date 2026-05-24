import React from 'react';
import { Calendar, User, GitBranch, Eye, Edit2, Trash2, Award } from 'lucide-react';

export interface Challenge {
  id: string;
  name: string;
  description?: string | null;
  type: string;
  track: string;
  status: string;
  challengeSource?: string | null;
  createdBy: string;
  updatedBy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  created: string;
  updated: string;
  prizes?: { place: number; value: number; currency: string }[] | null;
  phases?: { name: string; duration: number; status: string }[] | null;
  tags?: string[] | null;
  skills?: { name: string; level: string }[] | null;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onView: (challenge: Challenge) => void;
  onEdit: (challenge: Challenge) => void;
  onDelete: (id: string) => void;
  isDrizzle?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onView,
  onEdit,
  onDelete,
  isDrizzle = false
}) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-draft';
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate total prize pool
  const totalPrize = challenge.prizes 
    ? challenge.prizes.reduce((sum, p) => sum + p.value, 0)
    : 0;

  return (
    <div className={`glass-panel fade-in-up challenge-card-container ${challenge.status.toLowerCase()}`}>
      <style>{`
        .challenge-card-container {
          position: relative;
          overflow: hidden;
          transition: var(--transition-smooth);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          border-left: 4px solid transparent;
        }
        .challenge-card-container:hover {
          transform: translateY(-5px) scale(1.01);
          border-color: var(--accent-blue);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        }
        .challenge-card-container.active { border-left-color: var(--accent-green); }
        .challenge-card-container.completed { border-left-color: var(--accent-blue); }
        .challenge-card-container.cancelled { border-left-color: var(--accent-red); }
        .challenge-card-container.draft { border-left-color: var(--text-tertiary); }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          letter-spacing: 0.05em;
        }
        .status-badge.status-active { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .status-badge.status-completed { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .status-badge.status-cancelled { background: rgba(239, 110, 110, 0.15); color: #f87171; }
        .status-badge.status-draft { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; }

        .tag-source {
          background: rgba(139, 92, 246, 0.15);
          color: #c084fc;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .tag-orm {
          background: rgba(236, 72, 153, 0.15);
          color: #f472b6;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        
        .card-pill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .card-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }
      `}</style>

      <div>
        <div className="d-flex justify-content-between align-items-start mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className={`status-badge ${getStatusClass(challenge.status)}`}>
            {challenge.status}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {challenge.challengeSource && (
              <span className="tag-source">
                <GitBranch size={10} />
                {challenge.challengeSource}
              </span>
            )}
            <span className="tag-orm">{isDrizzle ? 'Drizzle' : 'Prisma'}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
          {challenge.name}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px' }}>
          {challenge.description || 'No description provided.'}
        </p>

        {/* Dynamic Tags Rendering */}
        {challenge.tags && challenge.tags.length > 0 && (
          <div className="card-pill-list">
            {challenge.tags.slice(0, 3).map((t, idx) => (
              <span key={idx} className="card-pill">{t}</span>
            ))}
            {challenge.tags.length > 3 && (
              <span className="card-pill" style={{ color: 'var(--accent-blue)' }}>+{challenge.tags.length - 3} more</span>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>TYPE</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{challenge.type}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>TRACK</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{challenge.track}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {totalPrize > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--accent-yellow)', fontWeight: 700 }}>
              <Award size={14} />
              <span>Prize Pool: ${totalPrize.toLocaleString()} USD</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Calendar size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>Start: {formatDate(challenge.startDate)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Calendar size={14} style={{ color: 'var(--accent-pink)' }} />
            <span>End: {formatDate(challenge.endDate)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <User size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>By: {challenge.createdBy}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button className="btn-icon" onClick={() => onView(challenge)} title="View Challenge">
          <Eye size={16} />
        </button>
        <button className="btn-icon" onClick={() => onEdit(challenge)} title="Edit Challenge" style={{ color: 'var(--accent-yellow)' }}>
          <Edit2 size={16} />
        </button>
        <button className="btn-icon" onClick={() => onDelete(challenge.id)} title="Delete Challenge" style={{ color: 'var(--accent-red)' }}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
export default ChallengeCard;
