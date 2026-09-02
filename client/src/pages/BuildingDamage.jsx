import React, { useState } from 'react';
import { Loader2, Info, AlertCircle } from 'lucide-react';
import { analyzeDamage } from '../services/damageApi';

import PageHeader from '../components/ui/PageHeader';
import UploadPanel from '../components/ui/UploadPanel';
import StatusBadge from '../components/ui/StatusBadge';
import ImageComparison from '../components/shared/ImageComparison';
import BuildingDetailDrawer from '../components/shared/BuildingDetailDrawer';
import { ErrorState } from '../components/ui/StateComponents';

const BuildingDamage = () => {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const handleBeforeUpload = (file) => {
    setBeforeImage(file);
    setBeforePreview(URL.createObjectURL(file));
  };
  const handleAfterUpload = (file) => {
    setAfterImage(file);
    setAfterPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!beforeImage || !afterImage) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('beforeImage', beforeImage);
    formData.append('afterImage', afterImage);

    try {
      const { data } = await analyzeDamage(formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis unavailable. We couldn\'t complete the AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <PageHeader 
        title="Building Damage Assessment" 
        description="Compare pre-disaster and post-disaster imagery to identify visible structural damage."
      />

      {!result ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <UploadPanel 
              title="Before Disaster" 
              type="before" 
              preview={beforePreview} 
              file={beforeImage} 
              onUpload={handleBeforeUpload} 
              onClear={() => { setBeforePreview(null); setBeforeImage(null); }} 
            />
            <UploadPanel 
              title="After Disaster" 
              type="after" 
              preview={afterPreview} 
              file={afterImage} 
              onUpload={handleAfterUpload} 
              onClear={() => { setAfterPreview(null); setAfterImage(null); }} 
            />
          </div>

          {error && <ErrorState message={error} />}

          <button 
            onClick={handleAnalyze} 
            disabled={loading || !beforeImage || !afterImage}
            className="w-full bg-brand hover:bg-brand-hover text-white py-4 rounded font-semibold text-[14px] transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:bg-bg-charcoal disabled:text-text-sec disabled:border disabled:border-border-dark disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> 
                <span>Assessing Damage...</span>
                <span className="text-text-main/50 font-normal ml-2">Detecting buildings • Comparing structures</span>
              </>
            ) : 'Analyze Damage'}
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Analysis Result</h2>
            <button 
              onClick={() => { setResult(null); setBeforePreview(null); setAfterPreview(null); setBeforeImage(null); setAfterImage(null); }}
              className="px-4 py-2 bg-bg-charcoal border border-border-dark hover:bg-bg-surface text-text-main text-[13px] font-medium rounded transition-colors"
            >
              New Analysis
            </button>
          </div>

          <ImageComparison beforeImage={beforePreview} afterImage={afterPreview} />

          {/* Damage Summary */}
          <div className="bg-bg-charcoal border border-border-dark rounded-lg p-4 sm:p-6">
            <h3 className="text-[12px] font-semibold text-text-sec uppercase tracking-wider mb-4 sm:mb-6">Damage Summary</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-bg-deep border border-border-dark rounded-lg p-4">
                <div className="text-[28px] font-bold text-text-main mb-1">{result.totalBuildings}</div>
                <div className="text-[12px] text-text-muted font-medium">Total Buildings</div>
              </div>
              <div className="bg-bg-deep border border-border-dark rounded-lg p-4">
                <div className="text-[28px] font-bold text-brand mb-1">{result.damagedBuildings}</div>
                <div className="text-[12px] text-text-muted font-medium">Damaged Buildings</div>
              </div>
              <div className="bg-bg-deep border border-border-dark rounded-lg p-4">
                <div className="text-[28px] font-bold text-brand mb-1">{Math.round(result.overallDamageRate)}%</div>
                <div className="text-[12px] text-text-muted font-medium flex items-center gap-1 cursor-help group relative">
                  Estimated Visual Damage Rate <Info className="w-3.5 h-3.5 text-text-sec" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-bg-surface border border-border-dark text-[11px] text-text-main rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center pointer-events-none font-normal">
                    This is an AI-based visual estimate from image comparison and is not a certified structural engineering assessment.
                  </div>
                </div>
              </div>
            </div>

            <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-4">Severity Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center justify-between p-3 rounded border border-border-dark bg-bg-surface">
                <span className="text-[13px] font-medium text-text-main">No Damage</span>
                <span className="text-[16px] font-bold text-text-sec">{result.noDamage}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded border border-[#78350F]/50 bg-[#451A03]/30">
                <span className="text-[13px] font-medium text-[#FBBF24]">Low</span>
                <span className="text-[16px] font-bold text-[#FBBF24]">{result.lowDamage}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded border border-brand/20 bg-brand/10">
                <span className="text-[13px] font-medium text-brand">Medium</span>
                <span className="text-[16px] font-bold text-brand">{result.mediumDamage}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded border border-[#7F1D1D]/50 bg-[#450A0A]/30">
                <span className="text-[13px] font-medium text-[#F87171]">High</span>
                <span className="text-[16px] font-bold text-[#F87171]">{result.highDamage}</span>
              </div>
            </div>
          </div>

          {/* Building Assessment Table */}
          <div className="space-y-4">
            <h3 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Building Assessment</h3>
            
            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto border border-border-dark rounded-lg bg-bg-charcoal">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-surface border-b border-border-dark text-text-sec text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3 font-semibold">Building</th>
                    <th className="px-5 py-3 font-semibold">Damage Level</th>
                    <th className="px-5 py-3 font-semibold">Est. Damage</th>
                    <th className="px-5 py-3 font-semibold">Confidence</th>
                    <th className="px-5 py-3 font-semibold">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                  {result.buildings.map((bldg) => (
                    <tr 
                      key={bldg.buildingId}
                      onClick={() => setSelectedBuilding(bldg)}
                      className="hover:bg-brand/5 border-l-2 border-l-transparent hover:border-l-brand cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-3 font-medium text-text-main text-[13px] whitespace-nowrap">
                        Building {bldg.buildingId < 10 ? `0${bldg.buildingId}` : bldg.buildingId}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={bldg.damageLevel} />
                      </td>
                      <td className="px-5 py-3 text-[13px] text-text-main">
                        {Math.round(bldg.damageRate)}%
                      </td>
                      <td className="px-5 py-3 text-[13px] text-brand font-medium">
                        {Math.round(bldg.confidence * 100)}%
                      </td>
                      <td className="px-5 py-3 text-[13px] text-text-sec truncate max-w-[300px]">
                        {bldg.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {result.buildings.map((bldg) => (
                <div 
                  key={bldg.buildingId}
                  onClick={() => setSelectedBuilding(bldg)}
                  className="bg-bg-charcoal border border-border-dark rounded-lg p-4 space-y-3 active:bg-brand/5 active:border-brand cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-main text-[14px]">Building {bldg.buildingId < 10 ? `0${bldg.buildingId}` : bldg.buildingId}</span>
                    <StatusBadge status={bldg.damageLevel} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[11px] text-text-sec uppercase tracking-wider">Est. Damage</div>
                      <div className="text-[14px] font-medium text-text-main">{Math.round(bldg.damageRate)}%</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-text-sec uppercase tracking-wider">Confidence</div>
                      <div className="text-[14px] font-medium text-brand">{Math.round(bldg.confidence * 100)}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-text-sec uppercase tracking-wider mb-0.5">Assessment</div>
                    <div className="text-[13px] text-text-sec line-clamp-2 leading-relaxed">{bldg.reason}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-text-muted uppercase tracking-widest mt-2 px-1">
              <AlertCircle className="w-3.5 h-3.5" /> 
              Click a building {`md:row`} to view detailed assessment
            </div>
          </div>
          
        </div>
      )}

      {selectedBuilding && (
        <BuildingDetailDrawer 
          building={selectedBuilding} 
          beforeImage={beforePreview} 
          afterImage={afterPreview} 
          onClose={() => setSelectedBuilding(null)}
        />
      )}
    </div>
  );
};

export default BuildingDamage;
