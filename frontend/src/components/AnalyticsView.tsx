import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import type { Challenge } from './ChallengeCard.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsViewProps {
  challenges: Challenge[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ challenges }) => {
  // 1. Status Distribution Data
  const statusCounts = challenges.reduce((acc: any, curr) => {
    const status = curr.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { active: 0, draft: 0, completed: 0, cancelled: 0 });

  const statusChartData = {
    labels: ['Active', 'Draft', 'Completed', 'Cancelled'],
    datasets: [{
      data: [statusCounts.active, statusCounts.draft, statusCounts.completed, statusCounts.cancelled],
      backgroundColor: [
        '#10b981', // green
        '#64748b', // slate
        '#3b82f6', // blue
        '#ef4444'  // red
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // 2. Track Distribution Data
  const trackCounts = challenges.reduce((acc: any, curr) => {
    acc[curr.track] = (acc[curr.track] || 0) + 1;
    return acc;
  }, {});

  const trackChartData = {
    labels: Object.keys(trackCounts),
    datasets: [{
      label: 'Challenges',
      data: Object.values(trackCounts),
      backgroundColor: 'rgba(139, 92, 246, 0.7)', // Purple
      borderColor: '#8b5cf6',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  // 3. Source Distribution Data
  const sourceCounts = challenges.reduce((acc: any, curr) => {
    const source = curr.challengeSource || 'No Source';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const sourceChartData = {
    labels: Object.keys(sourceCounts),
    datasets: [{
      data: Object.values(sourceCounts),
      backgroundColor: [
        '#3b82f6', // blue
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#f59e0b', // amber
        '#10b981', // emerald
        '#64748b'  // gray (no source)
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
          font: {
            family: 'Plus Jakarta Sans',
            size: 11
          }
        }
      }
    },
    scales: {
      y: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1',
          padding: 12,
          usePointStyle: true,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11
          }
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`
        .charts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .charts-row {
            grid-template-columns: 1fr;
          }
        }
        .chart-box {
          height: 320px;
          position: relative;
        }
      `}</style>

      <div className="charts-row">
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.02em' }}>
            CHALLENGE STATUS DISTRIBUTION
          </h3>
          <div className="chart-box">
            {challenges.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)' }}>
                No Data Available
              </div>
            ) : (
              <Doughnut data={statusChartData} options={doughnutOptions} />
            )}
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.02em' }}>
            CHALLENGES BY TRACK
          </h3>
          <div className="chart-box">
            {challenges.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)' }}>
                No Data Available
              </div>
            ) : (
              <Bar data={trackChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.02em' }}>
            CHALLENGE SOURCE SUMMARY
          </h3>
          <div className="chart-box">
            {challenges.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)' }}>
                No Data Available
              </div>
            ) : (
              <Doughnut data={sourceChartData} options={doughnutOptions} />
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.02em' }}>
              ANALYTICS INSIGHTS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-blue)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>MOST ACTIVE TRACK</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {Object.keys(trackCounts).reduce((a, b) => trackCounts[a] > trackCounts[b] ? a : b, 'None')}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>LEADING SOURCE ORIGIN</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {Object.keys(sourceCounts).filter(s => s !== 'No Source').reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b, 'None')}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginTop: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Insights are calculated reactively in real-time from active data nodes in PostgreSQL via Prisma/Drizzle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsView;
