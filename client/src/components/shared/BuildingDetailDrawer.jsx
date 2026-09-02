import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const BuildingDetailDrawer = ({ building, beforeImage, afterImage, onClose }) => {
  if (!building) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-bg-deep/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:max-w-md bg-bg-charcoal border-l border-border-dark shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border-dark">
          <h2 className="text-[15px] font-semibold text-text-main tracking-tight">BUILDING {building.buildingId}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded text-text-muted hover:text-text-main hover:bg-bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-text-sec uppercase tracking-wider">Damage Level</span>
              <div><StatusBadge status={building.damageLevel} /></div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-text-sec uppercase tracking-wider">Confidence</span>
              <div className="text-[16px] font-medium text-brand">{Math.round(building.confidence * 100)}%</div>
            </div>
            <div className="space-y-1 col-span-2 bg-bg-surface p-4 rounded-lg border border-border-dark">
              <span className="text-[11px] font-semibold text-text-sec uppercase tracking-wider">Estimated Visual Damage</span>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-[28px] font-bold text-text-main leading-none">{Math.round(building.damageRate)}%</span>
                <span className="text-[12px] text-text-muted mb-1">structural impact</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-[13px] font-semibold text-text-main flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-brand" /> Assessment Reason
            </h3>
            <p className="text-[14px] text-text-sec leading-relaxed bg-bg-surface p-4 rounded-lg border border-border-dark">
              {building.reason}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[13px] font-semibold text-text-main">Visual Evidence</h3>
            
            <div className="space-y-2">
              <span className="text-[12px] font-medium text-text-muted">After Disaster</span>
              <div className="rounded-lg overflow-hidden border border-border-dark bg-bg-deep h-48">
                <img src={afterImage} alt="After" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-[12px] font-medium text-text-muted">Before Disaster</span>
              <div className="rounded-lg overflow-hidden border border-border-dark bg-bg-deep h-48 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default BuildingDetailDrawer;
