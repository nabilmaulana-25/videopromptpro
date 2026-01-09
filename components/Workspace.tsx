
import React, { useState, useRef } from 'react';
import { Upload, FileVideo, CheckCircle2, Copy, RefreshCw, Layers, Zap, Info, Play, Download, Clock } from 'lucide-react';
import { analyzeVideo } from '../services/geminiService';
import { AnalysisResult, VideoSegment } from '../types';

const Workspace: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setResult(null);
      setActiveSegmentIndex(0);
    }
  };

  const startAnalysis = async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeVideo(base64, videoFile.type);
        setResult(analysis);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(videoFile);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      alert('Analysis failed. Please check your API key and file size.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const activeSegment: VideoSegment | null = result?.segments[activeSegmentIndex] || null;

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI Analysis Workspace</h2>
        {videoFile && (
          <button 
            onClick={() => {
              setVideoFile(null);
              setVideoUrl(null);
              setResult(null);
            }}
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-0">
        {/* Left Column: Input / Video */}
        <div className="flex flex-col gap-6 h-full">
          {!videoFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 mb-6 group-hover:scale-110 group-hover:bg-indigo-600/10 group-hover:text-indigo-500 transition-all">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Upload Source Video</h3>
              <p className="text-zinc-400 text-center max-w-sm">Upload a clip to generate time-segmented professional prompts.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="video/*" 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
              <div className="aspect-video bg-black relative">
                {videoUrl && (
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div className="p-6 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500">
                    <FileVideo size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-white truncate max-w-[150px]">{videoFile.name}</p>
                    <p className="text-xs text-zinc-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                {!result && !isAnalyzing && (
                  <button 
                    onClick={startAnalysis}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Zap size={18} />
                    Analyze Segments
                  </button>
                )}
                {isAnalyzing && (
                  <div className="flex items-center gap-3 text-indigo-400">
                    <RefreshCw size={18} className="animate-spin" />
                    <span className="font-medium">Deep Scanning...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Tips Box */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold mb-3">
              <Info size={16} />
              Segmented Mode
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We now detect scene transitions automatically. Use the duration selector on the right to browse prompts for specific timestamps of your video.
            </p>
          </div>
        </div>

        {/* Right Column: Analysis Output */}
        <div className="flex flex-col h-full overflow-hidden">
          {result ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl flex-1 flex flex-col overflow-hidden animate-in fade-in duration-700">
              <div className="p-6 border-b border-zinc-800 bg-zinc-900/40">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <h3 className="text-lg font-bold text-white">Multi-Duration Report</h3>
                  </div>
                  <button className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white transition-colors">
                    <Download size={18} />
                  </button>
                </div>
                
                {/* Timeline Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {result.segments.map((seg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSegmentIndex(idx)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        activeSegmentIndex === idx 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {seg.timestamp}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {activeSegment && (
                  <>
                    {/* Visual Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                      <MetadataItem label="Style Focus" value={activeSegment.visualStyle} />
                      <MetadataItem label="Lighting" value={activeSegment.lighting} />
                      <MetadataItem label="Camera" value={activeSegment.cameraWork} />
                      <MetadataItem label="Duration" value={activeSegment.timestamp} />
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3 flex items-center gap-2">
                        <Layers size={14} /> Segment Action
                      </h4>
                      <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                        {activeSegment.description}
                      </p>
                    </div>

                    {/* Generated Prompts */}
                    <div className="space-y-6">
                      <PromptBox 
                        title="Midjourney v6" 
                        prompt={activeSegment.generatedPrompts.midjourney} 
                        onCopy={() => copyToClipboard(activeSegment.generatedPrompts.midjourney)} 
                        color="text-indigo-400"
                        accent="border-indigo-500/20"
                      />
                      <PromptBox 
                        title="Stable Diffusion XL" 
                        prompt={activeSegment.generatedPrompts.stableDiffusion} 
                        onCopy={() => copyToClipboard(activeSegment.generatedPrompts.stableDiffusion)} 
                        color="text-emerald-400"
                        accent="border-emerald-500/20"
                      />
                      <PromptBox 
                        title="Google Veo" 
                        prompt={activeSegment.generatedPrompts.veo} 
                        onCopy={() => copyToClipboard(activeSegment.generatedPrompts.veo)} 
                        color="text-orange-400"
                        accent="border-orange-500/20"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-zinc-800 rounded-3xl bg-zinc-900/20 flex flex-col items-center justify-center text-center p-12">
              {isAnalyzing ? (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-zinc-800 border-t-indigo-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                      <Zap size={24} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Segmenting Video...</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto">Detecting scene changes and generating unique prompts for each duration.</p>
                  </div>
                  <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 animate-[loading_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-600 mx-auto mb-6">
                    <Clock size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-400">Duration Analysis</h3>
                  <p className="text-zinc-600 text-sm max-w-xs">Upload your video to see how the prompt engineering changes over time.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const MetadataItem = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">{label}</p>
    <p className="text-sm text-zinc-200 font-medium line-clamp-1">{value}</p>
  </div>
);

const PromptBox = ({ title, prompt, onCopy, color, accent }: { title: string, prompt: string, onCopy: () => void, color: string, accent: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-zinc-900 border ${accent} rounded-2xl p-5 hover:border-zinc-600 transition-colors relative group`}>
      <div className="flex items-center justify-between mb-3">
        <h5 className={`text-sm font-bold ${color}`}>{title}</h5>
        <button 
          onClick={handleCopy}
          className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-zinc-400 text-xs leading-relaxed font-mono selection:bg-indigo-500/30">
        {prompt}
      </p>
    </div>
  );
};

export default Workspace;
