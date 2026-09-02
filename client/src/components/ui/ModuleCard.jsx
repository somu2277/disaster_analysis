import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ModuleCard = ({ title, subtitle, description, capabilities, lastAnalysis, linkTo, icon: Icon }) => {
  return (
    <div className="bg-bg-charcoal border border-border-dark rounded-lg flex flex-col transition-colors hover:border-brand/30 h-full group">
      <div className="p-6 border-b border-border-dark flex-1">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2.5 rounded-md bg-brand-soft border border-brand/20 text-brand">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold tracking-wider text-text-sec uppercase">{title}</h3>
            <p className="text-[15px] text-text-main font-medium mt-0.5">{subtitle}</p>
          </div>
        </div>
        
        <p className="text-[14px] text-text-sec mb-6 leading-relaxed">{description}</p>
        
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Capabilities</h4>
          <ul className="text-[13px] text-text-sec space-y-2">
            {capabilities.map((cap, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-sm bg-brand/50"></span>
                {cap}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 bg-bg-surface/50 rounded-b-lg flex items-center justify-between">
        <div className="text-[12px] text-text-muted">
          Last analysis: <span className="text-text-sec">{lastAnalysis}</span>
        </div>
        <Link 
          to={linkTo} 
          className="text-[13px] font-medium text-brand hover:text-brand-hover flex items-center gap-1 transition-colors"
        >
          Open Analysis <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ModuleCard;
