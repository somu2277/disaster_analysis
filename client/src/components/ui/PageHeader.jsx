import React from 'react';

const PageHeader = ({ title, description, rightContent }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border-dark pb-4 mb-6 gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-text-main tracking-tight leading-tight">{title}</h1>
        {description && <p className="text-text-sec mt-1 sm:mt-1.5 text-xs sm:text-[14px] leading-relaxed max-w-2xl">{description}</p>}
      </div>
      {rightContent && <div className="mt-2 md:mt-0">{rightContent}</div>}
    </div>
  );
};

export default PageHeader;
