import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Building, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardApi';
import { getThermalHistory } from '../services/thermalApi';
import { getDamageHistory } from '../services/damageApi';

import PageHeader from '../components/ui/PageHeader';
import KpiCard from '../components/ui/KpiCard';
import ModuleCard from '../components/ui/ModuleCard';
import RecentAnalysisTable from '../components/shared/RecentAnalysisTable';
import { ErrorState } from '../components/ui/StateComponents';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const { data: statsData } = await getDashboardStats();
      setStats(statsData);

      // Fetch recent history (combine thermal and damage, sort by date, take top 5)
      const [thermalRes, damageRes] = await Promise.all([
        getThermalHistory(),
        getDamageHistory()
      ]);
      
      const combined = [...(thermalRes.data || []), ...(damageRes.data || [])];
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentHistory(combined.slice(0, 5));

    } catch (err) {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRowClick = (item, type) => {
    navigate('/history');
  };

  const rightHeaderContent = (
    <div className="flex items-center gap-4 text-[12px] text-text-muted">
      <div className="flex flex-col items-end">
        <span>Last updated</span>
        <span className="text-text-main font-medium">
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })},{' '}
          {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <button 
        onClick={fetchDashboardData}
        className="p-2 bg-bg-charcoal border border-border-dark hover:bg-bg-surface rounded transition-colors text-text-sec hover:text-text-main"
        title="Refresh Data"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader 
        title="Operational Overview" 
        description="Monitor thermal incidents and structural damage assessments from one workspace."
        rightContent={rightHeaderContent}
      />

      {error ? (
        <ErrorState message={error} onRetry={fetchDashboardData} />
      ) : (
        <>
          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              title="People Detected" 
              value={stats ? stats.peopleDetected : 0} 
              subtitle={`Across ${stats?.thermalAnalyses || 0} scans`}
              icon={Users} 
              isLoading={loading}
            />
            <KpiCard 
              title="Buildings Analyzed" 
              value={stats ? stats.buildingsAnalyzed : 0} 
              subtitle={`Across ${stats?.damageAnalyses || 0} assessments`}
              icon={Building} 
              isLoading={loading}
            />
            <KpiCard 
              title="Damaged Buildings" 
              value={stats ? stats.damagedBuildings : 0} 
              subtitle="Visually confirmed damage"
              icon={AlertTriangle} 
              isLoading={loading}
            />
            <KpiCard 
              title="High Damage" 
              value={stats ? stats.highDamageBuildings : 0} 
              subtitle="Critical structural failure"
              icon={Activity} 
              isLoading={loading}
            />
          </div>

          {/* Analysis Modules Section */}
          <div className="pt-2 sm:pt-4">
            <h2 className="text-[12px] font-semibold text-text-sec mb-4 uppercase tracking-wider">Analysis Modules</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <ModuleCard 
                title="Thermal Detection"
                subtitle="People & Temperature Analysis"
                description="Analyze thermal imagery to identify people and available thermal information."
                capabilities={[
                  "Person detection",
                  "Thermal pattern analysis",
                  "Temperature availability",
                  "Attention classification"
                ]}
                lastAnalysis={stats?.thermalAnalyses > 0 ? "Recently" : "No analysis yet"}
                linkTo="/thermal-detection"
                icon={Activity}
              />
              <ModuleCard 
                title="Building Damage"
                subtitle="Structural Damage Assessment"
                description="Compare pre-disaster and post-disaster imagery to assess visible building damage."
                capabilities={[
                  "Before / after comparison",
                  "Building detection",
                  "Damage classification",
                  "Damage statistics"
                ]}
                lastAnalysis={stats?.damageAnalyses > 0 ? "Recently" : "No analysis yet"}
                linkTo="/building-damage"
                icon={Building}
              />
            </div>
          </div>

          {/* Recent Analysis Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[12px] font-semibold text-text-sec uppercase tracking-wider">Recent Analysis</h2>
              <button onClick={() => navigate('/history')} className="text-[12px] font-medium text-brand hover:text-brand-hover transition-colors">
                View All
              </button>
            </div>
            
            {!loading && recentHistory.length === 0 ? (
              <div className="p-8 border border-border-dark rounded-lg text-center bg-bg-charcoal">
                <p className="text-[14px] text-text-sec mb-4">No analyses have been performed yet.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => navigate('/thermal-detection')} className="px-4 py-2 bg-brand hover:bg-brand-hover rounded text-[13px] font-medium text-white transition-colors">Run Thermal Scan</button>
                  <button onClick={() => navigate('/building-damage')} className="px-4 py-2 bg-bg-surface border border-border-dark hover:bg-border-dark rounded text-[13px] font-medium text-text-main transition-colors">Run Damage Assessment</button>
                </div>
              </div>
            ) : (
              <RecentAnalysisTable data={recentHistory} onRowClick={handleRowClick} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
