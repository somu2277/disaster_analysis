import React, { useState, useRef } from 'react';
import { Columns, Layers, ZoomIn } from 'lucide-react';

const ImageComparison = ({ beforeImage, afterImage }) => {
  const [mode, setMode] = useState('slider'); // 'slider' | 'side'
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between bg-bg-charcoal border border-border-dark p-1.5 rounded-lg">
        <div className="flex gap-1">
          <button 
            onClick={() => setMode('slider')}
            className={`px-3 py-1.5 rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors ${mode === 'slider' ? 'bg-bg-surface text-text-main' : 'text-text-sec hover:text-text-main hover:bg-bg-surface/50'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Overlay Slider
          </button>
          <button 
            onClick={() => setMode('side')}
            className={`px-3 py-1.5 rounded text-[12px] font-medium flex items-center gap-1.5 transition-colors ${mode === 'side' ? 'bg-bg-surface text-text-main' : 'text-text-sec hover:text-text-main hover:bg-bg-surface/50'}`}
          >
            <Columns className="w-3.5 h-3.5" /> Side by Side
          </button>
        </div>
        <div className="px-3 text-[12px] text-text-muted flex items-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5" /> Hover to inspect
        </div>
      </div>

      {/* Viewer */}
      <div className="bg-bg-deep border border-border-dark rounded-lg overflow-hidden min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
        {mode === 'slider' ? (
          <div ref={containerRef} className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] select-none group">
            <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden" 
              style={{ width: `${sliderPosition}%` }}
            >
              <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: containerRef.current?.offsetWidth || '100%' }} />
            </div>
            
            <div 
              className="absolute inset-y-0 w-0.5 bg-brand cursor-ew-resize shadow-[0_0_10px_rgba(249,115,22,0.3)] z-10"
              style={{ left: `calc(${sliderPosition}% - 1px)` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brand rounded-full shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 flex justify-between">
                  <div className="w-0.5 h-full bg-white"></div>
                  <div className="w-0.5 h-full bg-white"></div>
                </div>
              </div>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition} 
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
            
            <div className="absolute top-4 left-4 bg-bg-deep/80 backdrop-blur text-text-main text-[11px] font-semibold px-2.5 py-1 rounded border border-border-dark select-none pointer-events-none tracking-wider">BEFORE</div>
            <div className="absolute top-4 right-4 bg-bg-deep/80 backdrop-blur text-brand font-semibold text-[11px] px-2.5 py-1 rounded border border-border-dark select-none pointer-events-none tracking-wider">AFTER</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-dark min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            <div className="relative bg-bg-deep h-[300px] sm:h-[400px] md:h-auto">
              <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-bg-deep/80 backdrop-blur text-text-main text-[11px] font-semibold px-2.5 py-1 rounded border border-border-dark tracking-wider">BEFORE</div>
            </div>
            <div className="relative bg-bg-deep h-[300px] sm:h-[400px] md:h-auto">
              <img src={afterImage} alt="After" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-bg-deep/80 backdrop-blur text-brand font-semibold text-[11px] px-2.5 py-1 rounded border border-border-dark tracking-wider">AFTER</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageComparison;
