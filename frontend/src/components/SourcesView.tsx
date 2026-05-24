import React from 'react';
import { GitBranch, Briefcase, Cog, PlusCircle, HelpCircle } from 'lucide-react';
import type { Challenge } from './ChallengeCard.js';

interface SourcesViewProps {
  challenges: Challenge[];
  onSelectSource: (source: string) => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({ challenges, onSelectSource }) => {
  const sourceCounts = challenges.reduce((acc: any, curr) => {
    const source = curr.challengeSource || 'Unspecified';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'github':
        return <GitBranch size={28} style={{ color: '#c084fc' }} />;
      case 'work manager':
        return <Briefcase size={28} style={{ color: '#60a5fa' }} />;
      case 'topgear':
        return <Cog size={28} style={{ color: '#f472b6' }} />;
      case 'manual entry':
        return <PlusCircle size={28} style={{ color: '#fbbf24' }} />;
      default:
        return <HelpCircle size={28} style={{ color: '#94a3b8' }} />;
    }
  };

  return (
    <div>
      <style>{`
        .sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .source-card {
          cursor: pointer;
          position: relative;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .source-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-blue);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }
        .source-icon-container {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }
        .source-card:hover .source-icon-container {
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.05);
        }
      `}</style>

      <div className="sources-grid">
        {Object.entries(sourceCounts).map(([source, count]: [string, any]) => (
          <div 
            key={source} 
            className="glass-panel source-card fade-in-up"
            onClick={() => onSelectSource(source === 'Unspecified' ? '' : source)}
          >
            <div className="source-icon-container">
              {getSourceIcon(source)}
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                {source}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {count} challenge{count !== 1 ? 's' : ''} connected
              </p>
            </div>
          </div>
        ))}

        {Object.keys(sourceCounts).length === 0 && (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
            No Challenge Sources Registered
          </div>
        )}
      </div>
    </div>
  );
};
export default SourcesView;
