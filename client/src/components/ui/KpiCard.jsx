import React from 'react';

const KpiCard = ({ title, value, subtitle, icon: Icon, isLoading }) => {
  return (
    <div className="bg-bg-charcoal border border-border-dark rounded-lg p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold text-text-sec uppercase tracking-wider">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-brand" />}
      </div>
      <div>
        {isLoading ? (
          <div className="h-8 w-16 bg-bg-surface animate-pulse rounded mb-1"></div>
        ) : (
          <div className="text-[28px] font-bold text-text-main leading-none mb-1.5">{value}</div>
        )}
        
        {isLoading ? (
          <div className="h-4 w-24 bg-bg-surface animate-pulse rounded"></div>
        ) : (
          <div className="text-[12px] text-text-muted">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
