import React from 'react';

const InteractiveImageViewer = ({ src, alt, boxes = [] }) => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-bg-deep border border-border-dark flex items-center justify-center min-h-[300px] group">
      <img src={src} alt={alt} className="max-h-[600px] w-auto object-contain" />
      
      {/* If the backend returns bounding boxes (ymin, xmin, ymax, xmax from 0-1) */}
      {boxes.map((box, idx) => {
        if (!box.boundingBox) return null;
        const { ymin, xmin, ymax, xmax } = box.boundingBox;
        
        const top = `${ymin * 100}%`;
        const left = `${xmin * 100}%`;
        const height = `${(ymax - ymin) * 100}%`;
        const width = `${(xmax - xmin) * 100}%`;

        // Semantic colors for boxes
        let borderColor = 'border-brand';
        let bgColor = 'bg-brand/10';
        let labelBg = 'bg-brand';
        let labelText = 'text-text-main';

        if (box.damageLevel) {
          switch (box.damageLevel.toUpperCase()) {
            case 'NO DAMAGE':
            case 'NORMAL':
              borderColor = 'border-text-sec';
              bgColor = 'bg-text-sec/10';
              labelBg = 'bg-text-sec';
              break;
            case 'LOW':
              borderColor = 'border-[#D97706]';
              bgColor = 'bg-[#D97706]/10';
              labelBg = 'bg-[#D97706]';
              break;
            case 'HIGH':
              borderColor = 'border-[#DC2626]';
              bgColor = 'bg-[#DC2626]/10';
              labelBg = 'bg-[#DC2626]';
              break;
            case 'MEDIUM':
            case 'ATTENTION':
            case 'ELEVATED':
            default:
              break;
          }
        }
        
        return (
          <div 
            key={idx}
            className={`absolute border-2 pointer-events-none ${borderColor} ${bgColor}`}
            style={{ top, left, height, width }}
          >
            <div className={`absolute -top-6 left-0 ${labelBg} ${labelText} text-[10px] font-bold px-1.5 py-0.5 whitespace-nowrap rounded-t`}>
              {box.label || `Target ${idx + 1}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveImageViewer;
