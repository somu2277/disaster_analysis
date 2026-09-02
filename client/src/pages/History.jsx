import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Loader2, ArrowRight } from 'lucide-react';
import { getThermalHistory } from '../services/thermalApi';
import { getDamageHistory } from '../services/damageApi';

import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { EmptyState, ErrorState } from '../components/ui/StateComponents';

const History = () => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'thermal' | 'damage'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [thermalHistory, setThermalHistory] = useState([]);
  const [damageHistory, setDamageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const [thermalRes, damageRes] = await Promise.all([
        getThermalHistory(),
        getDamageHistory()
      ]);
      setThermalHistory(thermalRes.data || []);
      setDamageHistory(damageRes.data || []);
    } catch (err) {
      setError('Failed to load history records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const combinedHistory = useMemo(() => {
    let combined = [
      ...thermalHistory.map(item => ({ ...item, _type: 'thermal' })),
      ...damageHistory.map(item => ({ ...item, _type: 'damage' }))
    ];

    if (activeFilter !== 'all') {
      combined = combined.filter(item => item._type === activeFilter);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      combined = combined.filter(item => {
        const dateStr = formatDate(item.createdAt).toLowerCase();
        if (item._type === 'thermal') {
          return dateStr.includes(query) || item.overallStatus?.toLowerCase().includes(query) || item.aiExplanation?.toLowerCase().includes(query);
        } else {
          return dateStr.includes(query) || String(item.totalBuildings).includes(query);
        }
      });
    }

    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return combined;
  }, [thermalHistory, damageHistory, activeFilter, searchQuery]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Analysis History" 
        description="Review past disaster intelligence reports."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex bg-bg-charcoal border border-border-dark rounded p-1 overflow-x-auto max-w-full">
          <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>All Records</FilterButton>
          <FilterButton active={activeFilter === 'thermal'} onClick={() => setActiveFilter('thermal')}>Thermal</FilterButton>
          <FilterButton active={activeFilter === 'damage'} onClick={() => setActiveFilter('damage')}>Building Damage</FilterButton>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-charcoal border border-border-dark rounded py-2 pl-9 pr-4 text-[13px] text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchHistory} />
      ) : loading ? (
        <div className="bg-bg-charcoal border border-border-dark rounded-lg h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-text-muted" />
        </div>
      ) : combinedHistory.length === 0 ? (
        <div className="bg-bg-charcoal border border-border-dark rounded-lg">
          <EmptyState 
            title="No records found" 
            description={searchQuery ? "No analyses match your search criteria." : "No analyses have been performed yet."} 
          />
        </div>
      ) : (
        <div className="bg-bg-charcoal border border-border-dark rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-surface border-b border-border-dark text-text-sec text-[11px] uppercase tracking-wider">
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Result Summary</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {combinedHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-brand/5 transition-colors group">
                    <td className="px-5 py-4 text-[13px] text-text-sec whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      {item._type === 'thermal' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-brand/10 text-brand border-brand/20">
                          Thermal
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-bg-surface text-text-main border-border-dark">
                          Building Damage
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-text-sec">
                      {item._type === 'thermal' ? (
                        <span className="font-medium text-text-main">{item.peopleDetected} people detected</span>
                      ) : (
                        <span className="font-medium text-text-main">{item.damagedBuildings} / {item.totalBuildings} damaged ({Math.round(item.overallDamageRate)}%)</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status="COMPLETED" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-text-muted hover:text-brand transition-colors inline-flex items-center gap-1.5 text-[13px] font-medium">
                        View <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border-dark p-4 bg-bg-surface flex items-center justify-between text-[11px] text-text-muted">
            <span>Showing {combinedHistory.length} records</span>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterButton = ({ active, onClick, children }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded text-[13px] font-medium whitespace-nowrap transition-colors ${active ? 'bg-bg-surface text-text-main' : 'text-text-sec hover:text-text-main'}`}
  >
    {children}
  </button>
);

export default History;
