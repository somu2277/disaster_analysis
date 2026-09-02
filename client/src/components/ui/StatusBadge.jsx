import React from 'react';

const StatusBadge = ({ status }) => {
  const getColorClasses = () => {
    switch (status?.toUpperCase()) {
      case 'NO DAMAGE':
      case 'NORMAL':
        return 'bg-bg-surface text-text-sec border-border-dark';
      case 'LOW':
        return 'bg-[#451A03]/30 text-[#FBBF24] border-[#78350F]/50'; // Amber/Yellow for dark theme
      case 'MEDIUM':
      case 'ATTENTION':
      case 'ELEVATED':
        return 'bg-brand/10 text-brand border-brand/20'; // Primary Orange
      case 'HIGH':
        return 'bg-[#450A0A]/30 text-[#F87171] border-[#7F1D1D]/50'; // Red for dark theme
      case 'UNCERTAIN':
      case 'UNKNOWN':
      default:
        return 'bg-bg-deep text-text-muted border-border-dark';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border uppercase tracking-wider ${getColorClasses()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
