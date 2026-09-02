import React from 'react';
import { X, Users, Building, AlertTriangle, ShieldAlert, Thermometer, User, Info } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const HistoryDetailDrawer = ({ item, onClose }) => {
  if (!item) return null;

  const isThermal = item._type === 'thermal';

  // Construct image URLs. Fallback gracefully if image is unavailable.
  const getImageUrl = (path) => {
    if (!path) return '';
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    // Otherwise construct it based on the API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'https://disasteranalysis.onrender.com/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: '2-digit', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-bg-deep/80 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full md:max-w-2xl bg-bg-charcoal border-l border-border-dark shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-dark bg-bg-surface">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {isThermal ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-brand/10 text-brand border-brand/20">Thermal Analysis</span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border bg-bg-charcoal text-white border-border-dark">Building Damage</span>
              )}
              <StatusBadge status="COMPLETED" />
            </div>
            <div className="text-[13px] text-text-muted mt-1">{formatDate(item.createdAt)}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded text-text-muted hover:text-white hover:bg-bg-charcoal border border-transparent hover:border-border-dark transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          
          {/* THERMAL VIEW */}
          {isThermal && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-deep border border-border-dark rounded-lg p-4">
                  <div className="text-[12px] text-text-muted font-medium mb-1">People Detected</div>
                  <div className="text-[28px] font-bold text-white">{item.peopleDetected}</div>
                </div>
                <div className="bg-bg-deep border border-border-dark rounded-lg p-4">
                  <div className="text-[12px] text-text-muted font-medium mb-1">Overall Status</div>
                  <div className="mt-1"><StatusBadge status={item.overallStatus} /></div>
                </div>
              </div>

              {item.aiExplanation && (
                <div className="bg-bg-surface p-4 rounded-lg border border-border-dark text-[13px] text-text-main flex gap-3">
                  <Info className="w-5 h-5 text-brand shrink-0" />
                  <p className="leading-relaxed">{item.aiExplanation}</p>
                </div>
              )}

              {item.imagePath && (
                <div className="space-y-2">
                  <h3 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Scanned Image</h3>
                  <div className="rounded-lg overflow-hidden border border-border-dark bg-bg-deep max-h-[300px] flex items-center justify-center">
                    <img src={getImageUrl(item.imagePath)} alt="Thermal Scan" className="max-h-[300px] object-contain" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/15181C/6B7280?text=Image+Expired+from+Server'; }} />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Detected Individuals</h3>
                <div className="w-full overflow-x-auto border border-border-dark rounded-lg bg-bg-deep">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-surface border-b border-border-dark text-text-sec text-[11px] uppercase tracking-wider">
                        <th className="px-4 py-3 font-semibold">Person</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Temp</th>
                        <th className="px-4 py-3 font-semibold">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                      {item.people?.map((person, idx) => (
                        <tr key={idx} className="hover:bg-bg-surface/50 transition-colors">
                          <td className="px-4 py-3 text-[13px] font-medium text-text-main">
                            Person {person.id < 10 ? `0${person.id}` : person.id}
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={person.status} /></td>
                          <td className="px-4 py-3 text-[13px] text-text-main">
                            {person.temperatureAvailable ? `${person.temperature}°C` : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-brand">{Math.round(person.confidence * 100)}%</td>
                        </tr>
                      ))}
                      {(!item.people || item.people.length === 0) && (
                        <tr><td colSpan="4" className="px-4 py-6 text-center text-text-muted text-[13px]">No individuals recorded</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* DAMAGE VIEW */}
          {!isThermal && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-bg-deep border border-border-dark rounded-lg p-3">
                  <div className="text-[20px] font-bold text-white mb-0.5">{item.totalBuildings}</div>
                  <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Total</div>
                </div>
                <div className="bg-bg-deep border border-border-dark rounded-lg p-3">
                  <div className="text-[20px] font-bold text-brand mb-0.5">{item.damagedBuildings}</div>
                  <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Damaged</div>
                </div>
                <div className="bg-bg-deep border border-border-dark rounded-lg p-3">
                  <div className="text-[20px] font-bold text-[#F87171] mb-0.5">{item.highDamage}</div>
                  <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider">High Risk</div>
                </div>
                <div className="bg-bg-deep border border-border-dark rounded-lg p-3">
                  <div className="text-[20px] font-bold text-brand mb-0.5">{Math.round(item.overallDamageRate)}%</div>
                  <div className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Damage Rate</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Before Disaster</h3>
                  <div className="rounded-lg overflow-hidden border border-border-dark bg-bg-deep h-40 flex items-center justify-center">
                    <img src={getImageUrl(item.beforeImagePath)} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/15181C/6B7280?text=Image+Expired'; }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">After Disaster</h3>
                  <div className="rounded-lg overflow-hidden border border-border-dark bg-bg-deep h-40 flex items-center justify-center">
                    <img src={getImageUrl(item.afterImagePath)} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/15181C/6B7280?text=Image+Expired'; }} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Building Assessments</h3>
                <div className="space-y-3">
                  {item.buildings?.map((bldg) => (
                    <div key={bldg.buildingId} className="bg-bg-deep border border-border-dark rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-text-main text-[13px]">Building {bldg.buildingId < 10 ? `0${bldg.buildingId}` : bldg.buildingId}</span>
                        <StatusBadge status={bldg.damageLevel} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <div className="text-[10px] text-text-sec uppercase tracking-wider">Est. Damage</div>
                          <div className="text-[13px] font-medium text-text-main">{Math.round(bldg.damageRate)}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-text-sec uppercase tracking-wider">Confidence</div>
                          <div className="text-[13px] font-medium text-brand">{Math.round(bldg.confidence * 100)}%</div>
                        </div>
                      </div>
                      <div className="text-[12px] text-text-sec leading-relaxed p-2 bg-bg-charcoal rounded border border-border-dark">
                        {bldg.reason}
                      </div>
                    </div>
                  ))}
                  {(!item.buildings || item.buildings.length === 0) && (
                    <div className="p-6 text-center text-text-muted text-[13px] border border-border-dark rounded-lg">No building data available</div>
                  )}
                </div>
              </div>
            </>
          )}
          
        </div>
      </div>
    </>
  );
};

export default HistoryDetailDrawer;
