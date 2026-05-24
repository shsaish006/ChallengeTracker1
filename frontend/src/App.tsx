import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  LayoutDashboard, 
  ListTodo, 
  PlusCircle, 
  Activity, 
  CheckCircle, 
  Code2, 
  Network, 
  RefreshCw, 
  Search,
  Filter,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';

import type { Challenge } from './components/ChallengeCard.js';
import { ChallengeCard } from './components/ChallengeCard.js';
import { ChallengeModal } from './components/ChallengeModal.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { SourcesView } from './components/SourcesView.js';
import { AuditLogsView } from './components/AuditLogsView.js';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'challenges' | 'create' | 'drizzle' | 'sources' | 'audit'>('dashboard');

  // Core Data States
  const [challengesList, setChallengesList] = useState<Challenge[]>([]);
  const [types, setTypes] = useState<{ id: string; name: string }[]>([]);
  const [tracks, setTracks] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // API Base
  const API_BASE = '/api/v6/challenges';

  // Load Initial Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [challengesRes, typesRes, tracksRes] = await Promise.all([
        fetch(`${API_BASE}?limit=100`),
        fetch(`${API_BASE}/types`),
        fetch(`${API_BASE}/tracks`)
      ]);

      const challengesData = await challengesRes.json();
      const typesData = await typesRes.json();
      const tracksData = await tracksRes.json();

      if (challengesData.success) setChallengesList(challengesData.data || []);
      if (typesData.success) setTypes(typesData.data || []);
      if (tracksData.success) setTracks(tracksData.data || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showToast('Connection to server failed. Please verify the backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Notifications handler
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // CRUD API Actions
  const handleCreateOrUpdateChallenge = async (data: any, useDrizzle: boolean) => {
    try {
      const url = useDrizzle 
        ? `${API_BASE}/drizzle${selectedChallenge ? `/${selectedChallenge.id}` : ''}`
        : `${API_BASE}${selectedChallenge ? `/${selectedChallenge.id}` : ''}`;
      
      const method = selectedChallenge ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(
          selectedChallenge 
            ? `Challenge successfully updated using ${useDrizzle ? 'Drizzle ORM' : 'Prisma ORM'}!`
            : `Challenge successfully created using ${useDrizzle ? 'Drizzle ORM' : 'Prisma ORM'}!`, 
          'success'
        );
        setIsModalOpen(false);
        setSelectedChallenge(null);
        await loadData();
      } else {
        showToast(result.message || 'Operation failed.', 'error');
      }
    } catch (error) {
      console.error('API Error:', error);
      showToast('Network request encountered an issue.', 'error');
    }
  };

  const handleDeleteChallenge = async (id: string, useDrizzle: boolean = false) => {
    if (!window.confirm('Are you absolute certain you want to delete this challenge?')) return;
    
    try {
      const url = useDrizzle ? `${API_BASE}/drizzle/${id}` : `${API_BASE}/${id}`;
      const response = await fetch(url, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast(`Challenge deleted successfully using ${useDrizzle ? 'Drizzle' : 'Prisma'}!`, 'success');
        await loadData();
      } else {
        showToast(result.message || 'Deletion failed.', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Network communication error.', 'error');
    }
  };

  // Switch to Edit Mode
  const triggerEdit = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  // Switch to View Mode inside Modal
  const triggerView = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  // Drizzle Direct CRUD operations (Sandbox view)
  const [drizzleList, setDrizzleList] = useState<Challenge[]>([]);
  const [drizzleLoading, setDrizzleLoading] = useState(false);

  const fetchDrizzleChallenges = async () => {
    setDrizzleLoading(true);
    try {
      const res = await fetch(`${API_BASE}/drizzle`);
      const data = await res.json();
      if (data.success) {
        setDrizzleList(data.data || []);
        showToast('Successfully fetched challenges using Drizzle SQL Queries!', 'info');
      } else {
        showToast('Drizzle fetch failed.', 'error');
      }
    } catch (error) {
      showToast('Drizzle API disconnected.', 'error');
    } finally {
      setDrizzleLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'drizzle') {
      fetchDrizzleChallenges();
    }
  }, [activeTab]);

  // Reactive Stats Calculations
  const totalCount = challengesList.length;
  const activeCount = challengesList.filter(c => c.status.toLowerCase() === 'active').length;
  const completedCount = challengesList.filter(c => c.status.toLowerCase() === 'completed').length;
  const uniqueSources = new Set(challengesList.filter(c => c.challengeSource).map(c => c.challengeSource)).size;

  // Filtering Logic (Client Side)
  const filteredChallenges = challengesList.filter(challenge => {
    const matchesSearch = !search || 
      challenge.name.toLowerCase().includes(search.toLowerCase()) ||
      (challenge.description && challenge.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = !statusFilter || challenge.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = !typeFilter || challenge.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesTrack = !trackFilter || challenge.track.toLowerCase() === trackFilter.toLowerCase();
    const matchesSource = !sourceFilter || (challenge.challengeSource && challenge.challengeSource.toLowerCase() === sourceFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType && matchesTrack && matchesSource;
  }).sort((a, b) => {
    let aVal: any = a[sortBy as keyof Challenge] || '';
    let bVal: any = b[sortBy as keyof Challenge] || '';

    if (sortBy === 'created' || sortBy === 'updated' || sortBy === 'startDate' || sortBy === 'endDate') {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return (
    <div className="dashboard-layout">
      {/* Toast Notification Container */}
      <div className="toast-container">
        <style>{`
          .toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .toast-node {
            background: rgba(19, 23, 45, 0.9);
            border-left: 4px solid transparent;
            border-top: 1px solid var(--glass-border);
            border-right: 1px solid var(--glass-border);
            border-bottom: 1px solid var(--glass-border);
            color: white;
            padding: 16px 24px;
            border-radius: var(--radius-sm);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            font-size: 0.9rem;
            font-weight: 500;
            min-width: 320px;
            max-width: 450px;
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .toast-node.success { border-left-color: var(--accent-green); }
          .toast-node.error { border-left-color: var(--accent-red); }
          .toast-node.info { border-left-color: var(--accent-blue); }
        `}</style>
        {toasts.map(t => (
          <div key={t.id} className={`toast-node ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Sidebar Component */}
      <div className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Trophy size={32} style={{ color: 'var(--accent-purple)', filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' }} />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              CHALLENGE
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 700, letterSpacing: '0.1em' }}>
              TRACKER ADVANCED
            </p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <style>{`
            .nav-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 14px 20px;
              color: var(--text-secondary);
              text-decoration: none;
              font-size: 0.9rem;
              font-weight: 600;
              border-radius: var(--radius-md);
              border: 1px solid transparent;
              cursor: pointer;
              transition: var(--transition-smooth);
            }
            .nav-item:hover {
              color: var(--text-primary);
              background: rgba(255, 255, 255, 0.03);
              transform: translateX(4px);
            }
            .nav-item.active {
              color: white;
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
              border-color: rgba(139, 92, 246, 0.2);
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
          `}</style>
          
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} />
            Dashboard Overview
          </div>
          
          <div className={`nav-item ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>
            <ListTodo size={18} />
            All Challenges
          </div>

          <div className={`nav-item ${activeTab === 'create' ? 'active' : ''}`} onClick={() => { setSelectedChallenge(null); setIsModalOpen(true); }}>
            <PlusCircle size={18} />
            Create Challenge
          </div>

          <div className={`nav-item ${activeTab === 'drizzle' ? 'active' : ''}`} onClick={() => setActiveTab('drizzle')}>
            <Code2 size={18} />
            Drizzle Sandbox
          </div>

          <div className={`nav-item ${activeTab === 'sources' ? 'active' : ''}`} onClick={() => setActiveTab('sources')}>
            <Network size={18} />
            Challenge Sources
          </div>

          <div className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
            <ShieldCheck size={18} />
            Audit Logs (NoSQL)
          </div>
        </nav>

        <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Activity size={14} style={{ color: 'var(--accent-green)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>DATABASE STATUS</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>PostgreSQL Online</p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Dual ORM active: Prisma & Drizzle</p>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="main-viewport">
        {/* Header Block */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'capitalize' }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'challenges' && 'Challenges Management'}
              {activeTab === 'drizzle' && 'Drizzle ORM Sandbox'}
              {activeTab === 'sources' && 'Challenge Source Analytics'}
              {activeTab === 'audit' && 'System Audit trails'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
              {activeTab === 'dashboard' && 'Real-time database analytics and statistics tracker.'}
              {activeTab === 'challenges' && 'Advanced multi-criteria filtering and full CRUD actions.'}
              {activeTab === 'drizzle' && 'Perform native fast SQL operations using Drizzle ORM.'}
              {activeTab === 'sources' && 'Origin analysis of challenges across platforms.'}
              {activeTab === 'audit' && 'MongoDB NoSQL transaction audits and system history logs.'}
            </p>
          </div>

          <button className="btn btn-secondary" onClick={loadData} style={{ padding: '10px 18px' }} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'spin-anim' : ''} />
            <style>{`
              .spin-anim { animation: spin 1s linear infinite; }
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
            REFRESH
          </button>
        </header>

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
            <RefreshCw size={36} className="spin-anim" style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Synchronizing with database...
            </span>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Top Stat Bar - Visible on Dashboard and Challenges */}
            {(activeTab === 'dashboard' || activeTab === 'challenges') && (
              <div className="grid-cols-4" style={{ marginBottom: '40px' }}>
                <style>{`
                  .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    transition: var(--transition-smooth);
                    border: 1px solid var(--glass-border);
                  }
                  .stat-card:hover {
                    transform: translateY(-2px);
                    border-color: var(--accent-blue);
                  }
                  .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                  }
                `}</style>

                <div className="glass-panel stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)' }}>
                    <Trophy size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL CHALLENGES</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{totalCount}</div>
                  </div>
                </div>

                <div className="glass-panel stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--accent-green) 0%, #047857 100%)' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVE NODES</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{activeCount}</div>
                  </div>
                </div>

                <div className="glass-panel stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a78bfa 0%, var(--accent-pink) 100%)' }}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>COMPLETED</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{completedCount}</div>
                  </div>
                </div>

                <div className="glass-panel stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--accent-yellow) 0%, #d97706 100%)' }}>
                    <Network size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVE SOURCES</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{uniqueSources}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <AnalyticsView challenges={challengesList} />
            )}

            {/* TAB VIEW 2: CHALLENGES */}
            {activeTab === 'challenges' && (
              <div>
                {/* Advanced Search & Filtering Block */}
                <div className="glass-panel" style={{ marginBottom: '32px' }}>
                  <style>{`
                    .filters-grid {
                      display: grid;
                      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
                      gap: 16px;
                      align-items: center;
                    }
                    @media (max-width: 1200px) {
                      .filters-grid {
                        grid-template-columns: 1fr 1fr;
                      }
                    }
                    @media (max-width: 768px) {
                      .filters-grid {
                        grid-template-columns: 1fr;
                      }
                    }
                  `}</style>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                    <Filter size={16} style={{ color: 'var(--accent-blue)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>ADVANCED SEARCH ENGINE</span>
                  </div>

                  <div className="filters-grid">
                    <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                      <label className="form-label">SEARCH TERM</label>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                        <input 
                          type="text" 
                          className="form-input" 
                          style={{ paddingLeft: '44px' }}
                          placeholder="Search title or content..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">STATUS</label>
                      <select className="form-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">TYPE</label>
                      <select className="form-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="">All Types</option>
                        {types.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">TRACK</label>
                      <select className="form-input" value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)}>
                        <option value="">All Tracks</option>
                        {tracks.map(tr => (
                          <option key={tr.id} value={tr.name}>{tr.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">SOURCE</label>
                      <select className="form-input" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                        <option value="">All Sources</option>
                        {Array.from(new Set(challengesList.filter(c => c.challengeSource).map(c => c.challengeSource))).map(src => (
                          <option key={src} value={src || ''}>{src}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <SlidersHorizontal size={14} style={{ color: 'var(--text-tertiary)' }} />
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>SORT BY</span>
                        <select className="form-input" style={{ width: '130px', padding: '6px 12px', fontSize: '0.8rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                          <option value="created">Created Date</option>
                          <option value="name">Challenge Name</option>
                          <option value="startDate">Start Date</option>
                          <option value="endDate">End Date</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>ORDER</span>
                        <select className="form-input" style={{ width: '100px', padding: '6px 12px', fontSize: '0.8rem' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                          <option value="desc">Desc</option>
                          <option value="asc">Asc</option>
                        </select>
                      </div>
                    </div>

                    <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => {
                      setSearch('');
                      setStatusFilter('');
                      setTypeFilter('');
                      setTrackFilter('');
                      setSourceFilter('');
                      setSortBy('created');
                      setSortOrder('desc');
                      showToast('Search parameters cleared.', 'info');
                    }}>
                      CLEAR FILTERS
                    </button>
                  </div>
                </div>

                {/* Challenges Reactive List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                  {filteredChallenges.map(c => (
                    <ChallengeCard 
                      key={c.id} 
                      challenge={c} 
                      onView={triggerView} 
                      onEdit={triggerEdit} 
                      onDelete={(id) => handleDeleteChallenge(id, false)} 
                    />
                  ))}

                  {filteredChallenges.length === 0 && (
                    <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: 'var(--text-tertiary)' }}>
                      <Search size={48} style={{ marginBottom: '16px', color: 'var(--text-tertiary)' }} />
                      <h3 style={{ fontSize: '1.25rem', color: 'white', fontWeight: 700, marginBottom: '8px' }}>No Challenges Matched Search</h3>
                      <p style={{ fontSize: '0.9rem' }}>Try clearing filters or adjusting your query criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB VIEW 4: DRIZZLE SANDBOX */}
            {activeTab === 'drizzle' && (
              <div>
                <div className="glass-panel" style={{ marginBottom: '32px', borderLeft: '4px solid var(--accent-yellow)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 800, fontSize: '1.25rem', marginBottom: '12px' }}>
                    <Code2 size={24} />
                    NATIVE SQL DRIZZLE ORM LAYER
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Drizzle ORM bypasses normal Prisma routing, compiling clean TypeScript queries directly down into high-performance SQL. 
                    This sandbox environment communicates directly with the Drizzle controllers `/api/v6/challenges/drizzle` operating on the PostgreSQL schema.
                  </p>
                  <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={() => { setSelectedChallenge(null); setIsModalOpen(true); }} style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)' }}>
                      + CREATE DRIZZLE CHALLENGE
                    </button>
                    <button className="btn btn-secondary" onClick={fetchDrizzleChallenges} disabled={drizzleLoading}>
                      <RefreshCw size={14} className={drizzleLoading ? 'spin-anim' : ''} />
                      RELOAD SQL
                    </button>
                  </div>
                </div>

                {drizzleLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <RefreshCw size={32} className="spin-anim" style={{ color: '#fbbf24' }} />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                    {drizzleList.map(c => (
                      <ChallengeCard 
                        key={c.id} 
                        challenge={c} 
                        onView={triggerView} 
                        onEdit={triggerEdit} 
                        onDelete={(id) => handleDeleteChallenge(id, true)} 
                        isDrizzle={true}
                      />
                    ))}

                    {drizzleList.length === 0 && (
                      <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: 'var(--text-tertiary)' }}>
                        <Code2 size={48} style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.25rem', color: 'white', fontWeight: 700, marginBottom: '8px' }}>No Drizzle Challenges Found</h3>
                        <p style={{ fontSize: '0.9rem' }}>Create challenges above using Drizzle ORM query engines.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEW 5: SOURCES */}
            {activeTab === 'sources' && (
              <SourcesView 
                challenges={challengesList} 
                onSelectSource={(source) => {
                  setSourceFilter(source);
                  setActiveTab('challenges');
                }} 
              />
            )}

            {/* TAB VIEW 6: AUDIT TRAILS */}
            {activeTab === 'audit' && (
              <AuditLogsView />
            )}
          </>
        )}
      </div>

      {/* Dynamic Creation/Edit Modal */}
      <ChallengeModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedChallenge(null); }}
        onSubmit={handleCreateOrUpdateChallenge}
        challenge={selectedChallenge}
        types={types}
        tracks={tracks}
      />
    </div>
  );
};
export default App;
