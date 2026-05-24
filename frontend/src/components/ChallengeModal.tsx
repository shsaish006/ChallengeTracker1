import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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

  // Advanced Detail Lists
  const [prizes, setPrizes] = useState<{ place: number; value: number; currency: string }[]>([]);
  const [phases, setPhases] = useState<{ name: string; duration: number; status: string }[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Dynamic Prize Adding Inputs
  const [newPrizePlace, setNewPrizePlace] = useState(1);
  const [newPrizeValue, setNewPrizeValue] = useState(100);

  // Dynamic Phase Adding Inputs
  const [newPhaseName, setNewPhaseName] = useState('Submission');
  const [newPhaseDuration, setNewPhaseDuration] = useState(72);
  const [newPhaseStatus, setNewPhaseStatus] = useState('Open');

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

      // Populate JSON arrays from database
      const rawChallenge = challenge as any;
      setPrizes(rawChallenge.prizes || []);
      setPhases(rawChallenge.phases || []);
      
      const tagsArray = rawChallenge.tags || [];
      setTagsInput(tagsArray.join(', '));

      const skillsArray = rawChallenge.skills || [];
      const skillsText = skillsArray.map((sk: any) => sk.name).join(', ');
      setSkillsInput(skillsText);

      setErrors({});
    } else {
      setFormData({
        name: '',
        description: '',
        type: types[0]?.name || 'Code',
        track: tracks[0]?.name || 'Development',
        challengeSource: '',
        status: 'draft',
        createdBy: 'admin',
        startDate: '',
        endDate: ''
      });
      setPrizes([]);
      setPhases([]);
      setTagsInput('');
      setSkillsInput('');
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

  // Dynamic Adders and Removers
  const handleAddPrize = () => {
    if (newPrizeValue <= 0) return;
    const newPrize = { place: newPrizePlace, value: newPrizeValue, currency: 'USD' };
    setPrizes(prev => [...prev, newPrize].sort((a, b) => a.place - b.place));
    setNewPrizePlace(prev => prev + 1);
  };

  const handleRemovePrize = (index: number) => {
    setPrizes(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPhase = () => {
    if (!newPhaseName.trim() || newPhaseDuration <= 0) return;
    const newPhase = { name: newPhaseName.trim(), duration: newPhaseDuration, status: newPhaseStatus };
    setPhases(prev => [...prev, newPhase]);
    setNewPhaseName('');
  };

  const handleRemovePhase = (index: number) => {
    setPhases(prev => prev.filter((_, i) => i !== index));
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

    // Process Tags and Skills inputs
    const tags = tagsInput.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const skills = skillsInput.split(',')
      .map(sk => sk.trim())
      .filter(sk => sk.length > 0)
      .map(name => ({ name, level: 'Intermediate' }));
    
    const formattedData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      challengeSource: formData.challengeSource.trim() || null,
      prizes: prizes.length > 0 ? prizes : null,
      phases: phases.length > 0 ? phases : null,
      tags: tags.length > 0 ? tags : null,
      skills: skills.length > 0 ? skills : null
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
          max-width: 780px;
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          background: rgba(19, 23, 45, 0.85);
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
        
        /* Advanced panel styling */
        .advanced-toggle-bar {
          background: rgba(255,255,255,0.01);
          border: 1px dashed var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          margin-bottom: 20px;
          transition: var(--transition-fast);
        }
        .advanced-toggle-bar:hover {
          background: rgba(255,255,255,0.03);
          border-color: var(--accent-blue);
        }

        .list-creator-row {
          background: rgba(11, 13, 25, 0.4);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          padding: 16px;
          margin-bottom: 16px;
        }
        .badge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        .creator-badge {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-remove-item {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .btn-remove-item:hover {
          color: var(--accent-red);
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
              rows={3}
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

          <div className="form-group">
            <label className="form-label">CREATED BY</label>
            <input 
              type="text" 
              name="createdBy"
              className="form-input" 
              placeholder="e.g., admin"
              value={formData.createdBy}
              onChange={handleChange}
              disabled={challenge !== null}
            />
            {errors.createdBy && <div className="error-msg">{errors.createdBy}</div>}
          </div>

          {/* ADVANCED OPTIONAL SCHEMAS COLLAPSIBLE */}
          <div className="advanced-toggle-bar" onClick={() => setShowAdvanced(!showAdvanced)}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} />
              CONFIGURE OPTIONAL DETAILS (PRIZES, PHASES, TAGS, SKILLS)
            </span>
            {showAdvanced ? <ChevronUp size={16} style={{ color: 'var(--accent-blue)' }} /> : <ChevronDown size={16} style={{ color: 'var(--accent-blue)' }} />}
          </div>

          {showAdvanced && (
            <div style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.2)', paddingLeft: '16px', marginBottom: '24px' }}>
              
              {/* 1. Prizes Schema Config */}
              <div className="list-creator-row">
                <span className="form-label" style={{ fontSize: '0.8rem', color: 'white', marginBottom: '12px' }}>PRIZE STRUCTURES</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>PLACE (e.g. 1, 2)</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      value={newPrizePlace}
                      onChange={(e) => setNewPrizePlace(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>AMOUNT (USD)</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      value={newPrizeValue}
                      onChange={(e) => setNewPrizeValue(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '16px' }}
                    onClick={handleAddPrize}
                  >
                    ADD
                  </button>
                </div>
                
                <div className="badge-list">
                  {prizes.map((p, idx) => (
                    <div key={idx} className="creator-badge">
                      <span>Place #{p.place}: ${p.value}</span>
                      <button type="button" className="btn-remove-item" onClick={() => handleRemovePrize(idx)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {prizes.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No prizes added yet.</span>}
                </div>
              </div>

              {/* 2. Phases Schema Config */}
              <div className="list-creator-row">
                <span className="form-label" style={{ fontSize: '0.8rem', color: 'white', marginBottom: '12px' }}>TIMELINE PHASES</span>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>PHASE NAME</span>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      placeholder="e.g. Registration, Submission"
                      value={newPhaseName}
                      onChange={(e) => setNewPhaseName(e.target.value)}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>HOURS</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      value={newPhaseDuration}
                      onChange={(e) => setNewPhaseDuration(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>STATUS</span>
                    <select 
                      className="form-input" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      value={newPhaseStatus}
                      onChange={(e) => setNewPhaseStatus(e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '16px' }}
                    onClick={handleAddPhase}
                  >
                    ADD
                  </button>
                </div>

                <div className="badge-list">
                  {phases.map((ph, idx) => (
                    <div key={idx} className="creator-badge" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                      <span>{ph.name} ({ph.duration}h) - <span style={{ color: ph.status === 'Open' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>{ph.status}</span></span>
                      <button type="button" className="btn-remove-item" onClick={() => handleRemovePhase(idx)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {phases.length === 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No timeline phases added yet.</span>}
                </div>
              </div>

              {/* 3. Tags Schema Config */}
              <div className="form-group">
                <label className="form-label">TAGS (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. React, Go, MongoDB, Drizzle"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              {/* 4. Skills Schema Config */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">REQUIRED SKILLS (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Database Schemas, API Integration"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
              </div>

            </div>
          )}

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
