import React from 'react';
import { UploadCloud, X } from 'lucide-react';

const UploadPanel = ({ title, type, preview, file, onUpload, onClear }) => {
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) onUpload(selectedFile);
  };

  return (
    <div className="bg-bg-charcoal border border-border-dark rounded-lg p-5 flex flex-col h-full">
      <h3 className="text-[11px] font-semibold text-text-sec mb-4 tracking-widest uppercase">{title}</h3>
      
      {!preview ? (
        <label className="flex-1 border border-dashed border-border-dark hover:border-brand/50 hover:bg-bg-surface/50 transition-colors rounded-md p-6 flex flex-col items-center justify-center cursor-pointer min-h-[160px] group">
          <UploadCloud className="w-6 h-6 text-text-muted mb-2 group-hover:text-brand transition-colors" />
          <p className="text-text-main text-[14px] font-medium mb-1">Drag & Drop or Browse</p>
          <p className="text-text-muted text-[12px]">Supported: JPG, PNG, WEBP</p>
          <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleChange} />
        </label>
      ) : (
        <div className="flex-1 flex flex-col min-h-[160px]">
          <div className="relative rounded-md overflow-hidden bg-bg-deep border border-border-dark flex-1 flex items-center justify-center group">
            <img src={preview} alt={`${type} preview`} className="max-h-48 object-contain" />
            <button 
              onClick={onClear}
              className="absolute top-2 right-2 p-1.5 bg-bg-deep/90 text-text-sec hover:text-text-main border border-border-dark rounded transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {file && (
            <div className="mt-3 flex justify-between items-center text-[12px] text-text-muted px-1">
              <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
