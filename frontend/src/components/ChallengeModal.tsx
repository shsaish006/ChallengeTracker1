import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import type { Challenge } from './ChallengeCard.js';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, useDrizzle: boolean) => void;
  challenge: Challenge | null; // null means create mode
  types: { id: string; name: string }[];
  tracks: { id: string; name: string }[];
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  challenge,
  types,
  tracks
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    track: '',
    challengeSource: '',
    status: 'draft',
    createdBy: 'admin',
    startDate: '',
    endDate: ''
  });

  const [useDrizzle, setUseDrizzle] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (challenge) {
      setFormData({
        name: challenge.name || '',
        description: challenge.description || '',
        type: challenge.type || '',
        track: challenge.track || '',
        challengeSource: challenge.challengeSource || '',
        status: challenge.status || 'draft',
        createdBy: challenge.createdBy || 'admin',
        startDate: challenge.startDate ? new Date(challenge.startDate).toISOString().slice(0, 16) : '',
        endDate: challenge.endDate ? new Date(challenge.endDate).toISOString().slice(0, 16) : ''
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        description: '',
        type: types[0]?.name || '',
        track: tracks[0]?.name || '',
        challengeSource: '',
        status: 'draft',
        createdBy: 'admin',
        startDate: '',
        endDate: ''
      });
      setErrors({});
    }
  }, [challenge, isOpen, types, tracks]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.track) newErrors.track = 'Track is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Created By field is required';
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'End Date must be after Start Date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const formattedData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      challengeSource: formData.challengeSource.trim() || null
    };

    onSubmit(formattedData, useDrizzle);
  };

  return (
    <div className="modal-overlay">
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(4, 5, 11, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .modal-container {
          width: 100%;
          max-width: 720px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          background: rgba(19, 23, 45, 0.8);
          border: 1px solid var(--glass-border);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          border-radius: var(--radius-lg);
          padding: 32px;
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 16px;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .btn-close:hover {
          color: var(--text-primary);
          transform: rotate(90deg);
        }
        .orm-selector-bar {
          background: rgba(11, 13, 25, 0.6);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 6px;
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
        }
        .orm-tab {
          flex: 1;
          text-align: center;
          padding: 10px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .orm-tab.active.prisma {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }
        .orm-tab.active.drizzle {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
        }
        .orm-tab:not(.active) {
          color: var(--text-tertiary);
        }
        .orm-tab:not(.active):hover {
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.02);
        }
        .error-msg {
          color: var(--accent-red);
          font-size: 0.75rem;
          margin-top: 4px;
          font-weight: 600;
        }
      `}</style>

      <div className="modal-container">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {challenge ? <Sparkles size={20} style={{ color: 'var(--accent-purple)' }} /> : <Plus size={20} style={{ color: 'var(--accent-blue)' }} />}
            {challenge ? 'Update Challenge' : 'Create New Challenge'}
          </h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* ORM Engine Toggle */}
        <div className="orm-selector-bar">
          <div 
            className={`orm-tab ${!useDrizzle ? 'active prisma' : ''}`}
            onClick={() => setUseDrizzle(false)}
          >
            PRISMA ENGINE
          </div>
          <div 
            className={`orm-tab ${useDrizzle ? 'active drizzle' : ''}`}
            onClick={() => setUseDrizzle(true)}
          >
            DRIZZLE ENGINE
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">CHALLENGE NAME</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              placeholder="e.g., Reactive Analytics Dashboard"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="error-msg">{errors.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">CHALLENGE TYPE</label>
              <select 
                name="type"
                className="form-input"
                style={{ appearance: 'none', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                value={formData.type}
                onChange={handleChange}
              >
                {types.map(t => (
                  <option key={t.id} value={t.name} style={{ background: 'var(--bg-secondary)', color: 'white' }}>
                    {t.name}
                  </option>
                ))}
              </select>
              {errors.type && <div className="error-msg">{errors.type}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">CHALLENGE TRACK</label>
              <select 
                name="track"
                className="form-input"
                value={formData.track}
                onChange={handleChange}
              >
                {tracks.map(tr => (
                  <option key={tr.id} value={tr.name} style={{ background: 'var(--bg-secondary)', color: 'white' }}>
                    {tr.name}
                  </option>
                ))}
              </select>
              {errors.track && <div className="error-msg">{errors.track}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">CHALLENGE SOURCE</label>
              <input 
                type="text" 
                name="challengeSource"
                className="form-input" 
                placeholder="e.g., Work Manager, Topgear, Github"
                value={formData.challengeSource}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">STATUS</label>
              <select 
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft" style={{ background: 'var(--bg-secondary)', color: 'white' }}>Draft</option>
                <option value="active" style={{ background: 'var(--bg-secondary)', color: 'white' }}>Active</option>
                <option value="completed" style={{ background: 'var(--bg-secondary)', color: 'white' }}>Completed</option>
                <option value="cancelled" style={{ background: 'var(--bg-secondary)', color: 'white' }}>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">DESCRIPTION</label>
            <textarea 
              name="description"
              className="form-input" 
              rows={4}
              placeholder="Provide a detailed description of the challenge..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">START DATE & TIME</label>
              <input 
                type="datetime-local" 
                name="startDate"
                className="form-input" 
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">END DATE & TIME</label>
              <input 
                type="datetime-local" 
                name="endDate"
                className="form-input" 
                value={formData.endDate}
                onChange={handleChange}
              />
              {errors.endDate && <div className="error-msg">{errors.endDate}</div>}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">CREATED BY</label>
            <input 
              type="text" 
              name="createdBy"
              className="form-input" 
              placeholder="e.g., admin"
              value={formData.createdBy}
              onChange={handleChange}
              disabled={challenge !== null} // cannot edit createdBy in edit mode
            />
            {errors.createdBy && <div className="error-msg">{errors.createdBy}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className="btn btn-primary">
              {challenge ? 'SAVE CHANGES' : 'CREATE CHALLENGE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChallengeModal;
