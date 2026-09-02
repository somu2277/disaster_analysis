import React, { useState } from 'react';
import { Loader2, Activity, User, Users, Thermometer, Info, Trash2 } from 'lucide-react';
import { analyzeThermal } from '../services/thermalApi';
import PageHeader from '../components/ui/PageHeader';
import UploadPanel from '../components/ui/UploadPanel';
import StatusBadge from '../components/ui/StatusBadge';
import InteractiveImageViewer from '../components/shared/InteractiveImageViewer';
import { ErrorState } from '../components/ui/StateComponents';

const ThermalDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = (file) => {
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const { data } = await analyzeThermal(formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis unavailable. We couldn\'t complete the AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="Thermal Detection" 
        description="Analyze thermal imagery for human presence and available temperature information."
      />

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT: IMAGE INPUT */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <h2 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Image Input</h2>
          
          <div className="flex-1 flex flex-col min-h-[300px]">
            <UploadPanel 
              title="Thermal Scan" 
              type="thermal" 
              preview={preview} 
              file={selectedImage} 
              onUpload={handleUpload} 
              onClear={handleClear} 
            />
          </div>

          <div className="flex items-center gap-3">
            {preview && (
              <button 
                onClick={handleClear}
                disabled={loading}
                className="p-3 bg-bg-charcoal border border-border-dark hover:bg-bg-surface text-text-sec hover:text-text-main rounded transition-colors disabled:opacity-50"
                title="Remove Image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handleAnalyze} 
              disabled={loading || !selectedImage}
              className="flex-1 bg-brand hover:bg-brand-hover text-white py-3 rounded font-semibold text-[14px] transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:bg-bg-surface disabled:text-text-sec disabled:border disabled:border-border-dark"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Image...</> : 'Analyze Image'}
            </button>
          </div>
          
          {error && <ErrorState message={error} />}
        </div>

        {/* RIGHT: ANALYSIS RESULT */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-[12px] font-semibold text-text-main uppercase tracking-wider">Analysis Result</h2>
          
          {!result && !loading && (
            <div className="bg-bg-charcoal border border-dashed border-border-dark rounded-lg flex flex-col items-center justify-center min-h-[400px] text-text-muted">
              <Activity className="w-8 h-8 mb-3 opacity-30" />
              <p className="text-[13px]">Awaiting image analysis</p>
            </div>
          )}

          {loading && (
            <div className="bg-bg-charcoal border border-border-dark rounded-lg flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-10 h-10 mb-6">
                <div className="absolute inset-0 border-2 border-border-dark rounded-full"></div>
                <div className="absolute inset-0 border-2 border-brand rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-[14px] font-medium text-text-main mb-2">Analyzing image...</p>
              <ul className="text-[12px] text-text-sec space-y-1.5 text-center">
                <li>Detecting people</li>
                <li>Comparing thermal patterns</li>
                <li>Generating assessment</li>
              </ul>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-bg-charcoal border border-border-dark rounded-lg overflow-hidden">
                <div className="p-5 border-b border-border-dark flex items-center justify-between bg-bg-surface">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-brand/10 flex items-center justify-center text-brand">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-text-sec uppercase tracking-wider">People Detected</div>
                      <div className="text-[28px] font-bold text-text-main leading-none mt-1">{result.peopleDetected}</div>
                    </div>
                  </div>
                  <StatusBadge status={result.overallStatus} />
                </div>
                
                <div className="p-4 bg-bg-charcoal text-[14px] text-text-main flex items-start gap-3 border-b border-border-dark">
                  <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{result.aiExplanation}</p>
                </div>

                {result.peopleDetected > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-bg-surface/50 border-b border-border-dark text-text-sec text-[11px] uppercase tracking-wider">
                          <th className="px-5 py-3 font-semibold">Person</th>
                          <th className="px-5 py-3 font-semibold">Temperature</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-dark">
                        {result.people.map((person, idx) => (
                          <tr key={idx} className="bg-bg-charcoal hover:bg-bg-surface transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-[13px] font-medium text-text-main">
                                <User className="w-4 h-4 text-text-muted" /> Person {person.id < 10 ? `0${person.id}` : person.id}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              {person.temperatureAvailable ? (
                                <span className="text-[13px] font-medium text-text-main">{person.temperature}°C</span>
                              ) : (
                                <div className="group relative inline-block">
                                  <span className="text-[13px] text-text-muted border-b border-dashed border-text-muted cursor-help">Unavailable</span>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-bg-surface border border-border-dark text-[11px] text-text-main rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center pointer-events-none">
                                    The uploaded image does not contain sufficient calibrated temperature information for a reliable reading.
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={person.status} />
                            </td>
                            <td className="px-5 py-4 text-[13px] font-medium text-brand">
                              {Math.round(person.confidence * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-text-sec text-[13px]">
                    No individuals were detected in this thermal scan.
                  </div>
                )}
              </div>

              {/* Viewer */}
              <InteractiveImageViewer src={preview} alt="Thermal Result" boxes={[]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThermalDetection;
