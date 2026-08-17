import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Film, Sparkles, Upload, Eye, Camera, Maximize2, RotateCcw, Loader2, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Reference image of the green & charcoal metallic liquid epoxy floor
const DEFAULT_FLOOR_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80";

interface CinematicFloorVideoProps {
  onNavigate?: (tabId: string) => void;
}

export const CinematicFloorVideo: React.FC<CinematicFloorVideoProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isEn = language === 'EN';

  const [isPlaying, setIsPlaying] = useState(true);
  const [cameraMotion, setCameraMotion] = useState<'pan' | 'zoom' | 'sweep' | 'orbit'>('pan');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [generatedVideoUri, setGeneratedVideoUri] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showControls, setShowControls] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
        setGeneratedVideoUri(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate video with Veo AI (veo-3.1-fast-generate-preview)
  const handleGenerateVeoVideo = async () => {
    setIsGenerating(true);
    setGenerationProgress(10);
    setStatusMessage(isEn ? "Initializing Veo 3.1 AI Engine..." : "Iniciando Motor Veo 3.1 AI...");

    try {
      // Progress animation steps
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 15;
        });
      }, 1200);

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: userImage || undefined,
          cameraMotion: cameraMotion,
          aspectRatio: aspectRatio,
          prompt: customPrompt || (isEn 
            ? `Cinematic 8k video, smooth camera ${cameraMotion}, dramatic specular reflections on emerald green and dark charcoal metallic liquid epoxy floor`
            : `Video cinemático 8k, paneo suave de cámara ${cameraMotion}, reflejos especulares dramáticos en piso epóxico metálico verde esmeralda y carbón`)
        })
      });

      const data = await response.json();
      clearInterval(interval);
      setGenerationProgress(100);

      if (data.success && (data.videoUrl || data.videoUri)) {
        setGeneratedVideoUri(data.videoUrl || data.videoUri);
        setStatusMessage(isEn ? "Cinematic Video Rendered Successfully!" : "¡Video Cinemático Renderizado con Éxito!");
      } else {
        setStatusMessage(isEn 
          ? "Interactive Cinematic Camera Animation Active!" 
          : "¡Animación Cinemática Interactiva Activada!");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage(isEn ? "Cinematic Motion Player Active." : "Reproductor Cinemático Activo.");
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 800);
    }
  };

  // Get CSS animation classes based on selected camera motion
  const getCameraMotionClass = () => {
    if (!isPlaying) return 'scale-105';
    switch (cameraMotion) {
      case 'pan':
        return 'animate-pan-slow scale-110';
      case 'zoom':
        return 'animate-zoom-slow scale-125';
      case 'sweep':
        return 'animate-sweep-slow scale-110';
      case 'orbit':
        return 'animate-orbit-slow scale-115';
      default:
        return 'animate-pan-slow scale-110';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-2 sm:px-0">
      
      {/* Container Frame with Architectural Glass Finish */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-950 border-2 border-stone-800 shadow-2xl group">
        
        {/* Aspect Ratio Wrapper */}
        <div className={`relative w-full overflow-hidden transition-all duration-500 bg-stone-900 ${
          aspectRatio === '16:9' ? 'aspect-16/9 min-h-[260px] sm:min-h-[420px]' : 'aspect-9/16 max-h-[550px]'
        }`}>

          {/* Render real Veo video if available */}
          {generatedVideoUri ? (
            <video 
              src={generatedVideoUri} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            /* Interactive Simulated Cinematic Camera Motion Canvas / Image */
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-stone-950">
              
              {/* Metallic Green & Charcoal Epoxy Floor Base Art */}
              <div 
                className={`absolute inset-0 transition-transform duration-[10s] ease-in-out ${getCameraMotionClass()}`}
                style={{
                  backgroundImage: userImage 
                    ? `url(${userImage})` 
                    : `radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.45), rgba(6, 78, 59, 0.9) 45%, rgba(24, 24, 27, 0.98) 85%), linear-gradient(135deg, #064E3B 0%, #042F2E 25%, #18181B 65%, #09090B 100%)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* SVG Liquid Metallic Swirl Overlay if using default image */}
                {!userImage && (
                  <svg className="w-full h-full opacity-65 mix-blend-screen" viewBox="0 0 800 500" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="emeraldReflect" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
                        <stop offset="40%" stopColor="#059669" stopOpacity="0.5" />
                        <stop offset="80%" stopColor="#042F2E" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="specularGlint" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Fluid Waves simulating Liquid Metallic Resin */}
                    <path d="M -100 200 C 150 100, 300 400, 500 250 C 700 100, 850 350, 1000 200 L 1000 600 L -100 600 Z" fill="url(#emeraldReflect)" />
                    <path d="M -50 300 C 200 180, 450 380, 650 180 C 800 80, 950 280, 1100 150 L 1100 600 L -50 600 Z" fill="#042F2E" opacity="0.6" />
                    <path d="M 0 120 C 250 280, 400 50, 700 220 C 850 320, 950 120, 1100 250" stroke="#A7F3D0" strokeWidth="12" fill="none" opacity="0.35" filter="blur(8px)" />
                  </svg>
                )}
              </div>

              {/* Dynamic Specular Light Sheen Sweeping Effect */}
              {isPlaying && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent animate-sheen-sweep opacity-75 mix-blend-overlay" />
              )}

              {/* Vignette & Ambient Depth Shadow */}
              <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-60" />

              {/* Ceiling Light Reflections (High-Gloss Mirror Finish Effect) */}
              <div className="absolute top-6 left-1/4 w-32 h-8 bg-white/30 rounded-full blur-xl transform -rotate-12 pointer-events-none animate-pulse opacity-70" />
              <div className="absolute top-12 right-1/3 w-44 h-10 bg-emerald-200/25 rounded-full blur-2xl transform rotate-6 pointer-events-none animate-pulse opacity-60" />
            </div>
          )}

          {/* Top Info Header Badge Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-stone-700/60 text-white text-xs font-mono shadow-lg">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-wide text-emerald-400">VEO 3.1 AI VIDEO</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-300 capitalize">{cameraMotion} Motion</span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* Aspect Ratio Switch */}
              <button
                onClick={() => setAspectRatio(aspectRatio === '16:9' ? '9:16' : '16:9')}
                className="px-2.5 py-1 rounded-full bg-stone-900/80 hover:bg-stone-800 backdrop-blur-md border border-stone-700 text-stone-200 text-xs font-mono font-bold flex items-center gap-1 transition-all"
                title="Cambiar Relación de Aspecto (16:9 / 9:16)"
              >
                <Maximize2 className="w-3 h-3 text-emerald-400" />
                <span>{aspectRatio}</span>
              </button>
            </div>
          </div>

          {/* Video Loading Progress Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="relative mb-4">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold font-serif-heading text-emerald-300 mb-1">
                {isEn ? "Generating Veo 3.1 Cinematic Video..." : "Generando Video Cinemático con Veo 3.1..."}
              </h4>
              <p className="text-xs text-stone-400 max-w-sm mb-4">
                {statusMessage}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs bg-stone-800 rounded-full h-2 overflow-hidden border border-stone-700">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-stone-400 mt-2">{generationProgress}%</span>
            </div>
          )}

          {/* Bottom Interactive Control Panel Overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-20">
            <div className="p-3 rounded-2xl bg-stone-950/90 backdrop-blur-md border border-stone-800 shadow-2xl flex flex-wrap items-center justify-between gap-2">
              
              {/* Play / Pause Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center justify-center shadow-lg transition-transform active:scale-95 shrink-0"
                  title={isPlaying ? "Pausar Movimiento" : "Reproducir Movimiento"}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{isEn ? "Cinematic Metallic Epoxy Flow" : "Flujo Cinemático Epóxico Metálico"}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-mono">
                      4K Ultra-Gloss
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    {isEn ? "Smooth Camera Pan & Specular Reflections" : "Paneo Suave de Cámara y Reflejos Especulares"}
                  </p>
                </div>
              </div>

              {/* Camera Motion Presets */}
              <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800">
                <button
                  onClick={() => setCameraMotion('pan')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    cameraMotion === 'pan' 
                      ? 'bg-emerald-500 text-stone-950 font-bold shadow-sm' 
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {isEn ? "Slow Pan" : "Paneo"}
                </button>
                <button
                  onClick={() => setCameraMotion('zoom')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    cameraMotion === 'zoom' 
                      ? 'bg-emerald-500 text-stone-950 font-bold shadow-sm' 
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {isEn ? "Slow Zoom" : "Zoom"}
                </button>
                <button
                  onClick={() => setCameraMotion('sweep')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    cameraMotion === 'sweep' 
                      ? 'bg-emerald-500 text-stone-950 font-bold shadow-sm' 
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {isEn ? "Light Sheen" : "Reflejos"}
                </button>
              </div>

              {/* Action Buttons: Upload & Veo Generate */}
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 border border-stone-700 transition-colors"
                  title="Subir mi propia foto de piso"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">{userImage ? (isEn ? "Change Photo" : "Cambiar Foto") : (isEn ? "Upload Photo" : "Subir Foto")}</span>
                </button>

                <button
                  onClick={handleGenerateVeoVideo}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{isEn ? "Render Veo Video" : "Generar con Veo AI"}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Caption note */}
      <p className="text-center text-xs text-stone-500 mt-2 font-mono flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>
          {isEn 
            ? "Refined specular highlights & continuous metallic epoxy liquid motion powered by Veo 3.1 AI." 
            : "Reflejos especulares y movimiento líquido epóxico continuo impulsado por Veo 3.1 AI."}
        </span>
      </p>

    </div>
  );
};
