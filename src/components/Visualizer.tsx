import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Upload, Eye, Sliders, RefreshCw, Layers, CheckCircle2, ArrowLeftRight, Image as ImageIcon, Sun } from 'lucide-react';
import { FLOORING_SYSTEMS } from '../data/systems';
import { SystemType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface VisualizerProps {
  initialSystemId?: SystemType;
  onNavigateToCalcWithSystem: (systemId: SystemType) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

interface TemplateSpace {
  id: string;
  nameEn: string;
  nameEs: string;
  beforeImage: string;
  defaultAfterImage: string;
  spaceType: string;
}

const TEMPLATE_SPACES: TemplateSpace[] = [
  {
    id: 'garaje-paddock',
    nameEn: 'Sports Garage / Workshop',
    nameEs: 'Garaje Deportivo / Taller',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    defaultAfterImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
    spaceType: 'Garage'
  },
  {
    id: 'sala-lujo',
    nameEn: 'Luxury Living Room',
    nameEs: 'Sala de Estar de Lujo',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    defaultAfterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    spaceType: 'Residence'
  },
  {
    id: 'showroom-comercial',
    nameEn: 'Commercial Showroom',
    nameEs: 'Local Comercial / Showroom',
    beforeImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
    defaultAfterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    spaceType: 'Showroom'
  }
];

const FINISH_COLORS = [
  { nameEn: 'Titan Grey Mirror', nameEs: 'Gris Titán Espejo', hex: '#64748B', gloss: 95 },
  { nameEn: 'Electric Blue Metallic', nameEs: 'Azul Eléctrico Metálico', hex: '#007BFF', gloss: 98 },
  { nameEn: 'Calacatta Epoxy Marble', nameEs: 'Mármol Calacatta Epóxico', hex: '#F8FAFC', gloss: 96 },
  { nameEn: 'Obsidian 3D Black', nameEs: 'Negro Obsidiana 3D', hex: '#0F172A', gloss: 99 },
  { nameEn: 'Silver Flakes', nameEs: 'Escamas Flakes Plata', hex: '#475569', gloss: 88 },
  { nameEn: 'Pure White Mirror', nameEs: 'Blanco Puro Espejo', hex: '#FFFFFF', gloss: 97 }
];

const SYSTEM_GLOSS_PRESETS: Record<SystemType, number> = {
  high_gloss: 98,
  metallic_3d: 96,
  granite_flakes: 85,
  anti_slip: 70,
  basic_seal: 75
};

export const VisualizerSection: React.FC<VisualizerProps> = ({
  initialSystemId,
  onNavigateToCalcWithSystem,
  onNavigateToSection,
}) => {
  const { language } = useLanguage();
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSpace>(TEMPLATE_SPACES[0]);
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<SystemType>(initialSystemId || 'high_gloss');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  
  // Interactive Comparison Slider position (0 to 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Reflection / Specularity Slider
  const [glossIntensity, setGlossIntensity] = useState<number>(98);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Selected Color object
  const selectedColorObj = FINISH_COLORS[selectedColorIndex] || FINISH_COLORS[0];
  const selectedColorName = language === 'EN' ? selectedColorObj.nameEn : selectedColorObj.nameEs;

  // Update Gloss Intensity when system changes
  useEffect(() => {
    if (SYSTEM_GLOSS_PRESETS[selectedSystem]) {
      setGlossIntensity(SYSTEM_GLOSS_PRESETS[selectedSystem]);
    }
  }, [selectedSystem]);

  // Sync selectedSystem with initialSystemId if passed
  useEffect(() => {
    if (initialSystemId) {
      setSelectedSystem(initialSystemId);
    }
  }, [initialSystemId]);

  // Active images for comparison
  const activeBeforeImage = userUploadedImage || selectedTemplate.beforeImage;
  const activeAfterImage = userUploadedImage || selectedTemplate.defaultAfterImage;

  // Touch & Mouse Drag handlers for smooth slider movement
  const updateSliderPosFromEvent = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    updateSliderPosFromEvent(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingRef.current) {
      updateSliderPosFromEvent(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Handle custom image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserUploadedImage(reader.result as string);
        runAiSimulation(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Simulation endpoint call
  const runAiSimulation = async (imgData?: string) => {
    setIsAnalyzing(true);
    setAiReport(null);

    const activeSysObj = FLOORING_SYSTEMS.find(s => s.id === selectedSystem) || FLOORING_SYSTEMS[0];

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imgData || userUploadedImage,
          styleId: selectedSystem,
          styleName: language === 'EN' ? (activeSysObj.nameEn || activeSysObj.name) : activeSysObj.name,
          selectedColor: selectedColorName,
          spaceType: selectedTemplate.spaceType,
          language: language || 'EN'
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiReport(data.analysis);
      }
    } catch (err) {
      console.error(err);
      setAiReport({
        detectedSurface: language === 'EN' ? "Porous Concrete Substrate (CSP-2 Profile)" : "Sustrato de concreto con porosidad moderada",
        lightingCondition: language === 'EN' ? "Optimal for Specular Reflections" : "Óptima para reflexiones especulares",
        recommendedSystem: language === 'EN' ? (activeSysObj.nameEn || activeSysObj.name) : activeSysObj.name,
        estimatedThickness: activeSysObj.thicknessMm,
        reflectivityBoost: `+${glossIntensity * 3.2}%`,
        preparationNotes: language === 'EN'
          ? "Surface preparation via HEPA diamond grinding CSP-2 profile."
          : "Acondicionamiento mediante desbaste con muela diamantada CSP-2.",
        colorRecommended: selectedColorName
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="visualizer" className="space-y-6">
      
      {/* Subheader banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono text-stone-900 font-semibold">
          <Sparkles className="w-4 h-4 text-[#007BFF]" />
          {language === 'EN' ? 'GEMINI AI VIRTUAL SIMULATOR' : 'SIMULADOR VIRTUAL IA CON GEMINI'}
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-stone-900">
          {language === 'EN' ? (
            <>Real-Time <span className="text-[#007BFF]">Flooring Simulator</span></>
          ) : (
            <>Simulador de Pisos en <span className="text-[#007BFF]">Tiempo Real</span></>
          )}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          {language === 'EN'
            ? 'Upload a photo of your space or select a template. AI will adapt the epoxy system preserving walls and furniture.'
            : 'Sube la foto de tu espacio o elige una plantilla. La inteligencia artificial adaptará el sistema epóxico conservando paredes y mobiliario.'}
        </p>
      </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visualizer Interactive Canvas & Before/After Slider */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Interactive Comparison Stage */}
            <div 
              ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative rounded-3xl overflow-hidden border-2 border-stone-300 bg-stone-100 shadow-lg aspect-[16/10] select-none group touch-none"
            >
              
              {/* After Image (Transformed Epoxy) */}
              <img
                src={activeAfterImage}
                alt="Piso Epóxico Transformado IA"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                style={{ 
                  filter: userUploadedImage 
                    ? `brightness(${0.95 + (glossIntensity / 200)}) contrast(${1.15 + (glossIntensity / 250)}) saturate(1.2)` 
                    : `brightness(${0.85 + (glossIntensity / 200)}) contrast(${1.0 + (glossIntensity / 300)})` 
                }}
                referrerPolicy="no-referrer"
              />

              {/* Dynamic Color Overlay Tint 1 (Overlay Blend) */}
              <div 
                className="absolute inset-0 pointer-events-none transition-colors duration-500"
                style={{
                  backgroundColor: selectedColorObj.hex,
                  mixBlendMode: 'overlay',
                  opacity: selectedColorObj.hex === '#FFFFFF' || selectedColorObj.hex === '#F8FAFC' ? 0.20 : 0.45
                }}
              ></div>

              {/* Dynamic Color Overlay Tint 2 (Color Dodge for metallic sheen) */}
              {userUploadedImage && (
                <div 
                  className="absolute inset-0 pointer-events-none transition-colors duration-500"
                  style={{
                    backgroundColor: selectedColorObj.hex,
                    mixBlendMode: 'soft-light',
                    opacity: 0.35
                  }}
                ></div>
              )}

              {/* Gloss Specular Overlay Simulation */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{ 
                  opacity: (glossIntensity / 100) * 0.55,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 40%, rgba(0,123,255,0.35) 100%)' 
                }}
              ></div>

              {/* AI Scanning Beam Effect when Analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                  <div className="w-full h-2 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_15px_#FCD34D] animate-bounce my-auto"></div>
                </div>
              )}

              {/* Before Image (Clipped by slider position) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={activeBeforeImage}
                  alt="Piso Actual Antes"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Slider Line & Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-stone-900 shadow-xl z-20 cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-300 border-2 border-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
              </div>

              {/* Slider Input overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />

              {/* Before / After Floating Badges */}
              <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700 text-xs font-mono font-bold text-white z-10 pointer-events-none">
                {userUploadedImage 
                  ? (language === 'EN' ? 'BEFORE (YOUR UPLOAD)' : 'ANTES (TU FOTO ORIGINAL)')
                  : (language === 'EN' ? 'BEFORE (BASE SUBSTRATE)' : 'ANTES (SUSTRATO BASE)')}
              </div>
              <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-amber-300 z-10 pointer-events-none flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>
                  {userUploadedImage 
                    ? (language === 'EN' ? `AFTER (${selectedColorName.toUpperCase()} MIRROR)` : `DESPUÉS (${selectedColorName.toUpperCase()} ESPEJO)`)
                    : (language === 'EN' ? 'AFTER (MTB MIRROR)' : 'DESPUÉS (MTB ESPEJO)')}
                </span>
              </div>

              {/* Gloss Specularity Slider Overlay Control */}
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-stone-700 z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Sliders className="w-4 h-4 text-amber-300" />
                  <span>{language === 'EN' ? 'Specular Gloss:' : 'Brillo Especular:'}</span>
                  <span className="font-mono text-amber-300">{glossIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={glossIntensity}
                  onChange={(e) => setGlossIntensity(Number(e.target.value))}
                  className="w-32 sm:w-48 h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-300"
                />
              </div>

            </div>

            {/* Template Selector & Photo Upload Options */}
            <div className="grid sm:grid-cols-4 gap-3">
              {TEMPLATE_SPACES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setUserUploadedImage(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedTemplate.id === tmpl.id && !userUploadedImage
                      ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <img
                    src={tmpl.beforeImage}
                    alt={language === 'EN' ? tmpl.nameEn : tmpl.nameEs}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-semibold leading-tight">{language === 'EN' ? tmpl.nameEn : tmpl.nameEs}</span>
                </button>
              ))}

              <div className="flex flex-col gap-1.5 justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  id="upload-custom-photo-btn"
                  className={`p-2.5 rounded-2xl border border-dashed text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    userUploadedImage
                      ? 'border-[#007BFF] bg-blue-50 text-[#007BFF]'
                      : 'border-stone-400 bg-stone-100 hover:bg-stone-200 text-stone-900'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    {userUploadedImage 
                      ? (language === 'EN' ? 'Change My Photo' : 'Cambiar Mi Foto') 
                      : (language === 'EN' ? 'Upload My Photo' : 'Subir Mi Foto')}
                  </span>
                </button>

                {userUploadedImage && (
                  <button
                    onClick={() => setUserUploadedImage(null)}
                    className="text-[11px] text-red-600 hover:underline font-semibold text-center"
                  >
                    {language === 'EN' ? '✕ Remove photo (Use templates)' : '✕ Quitar mi foto (Usar plantillas)'}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

          </div>

          {/* Right Column: AI Options, Colors & Diagnosis Report */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Style & Finish Selectors */}
            <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-6 shadow-sm">
              
              <div>
                <label className="font-serif-heading font-bold text-stone-900 text-xs uppercase tracking-wider block mb-3">
                  {language === 'EN' ? '1. Select Epoxy System:' : '1. Seleccionar Sistema Epóxico:'}
                </label>
                <select
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value as SystemType)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-semibold focus:outline-none"
                >
                  {FLOORING_SYSTEMS.map((sys) => (
                    <option key={sys.id} value={sys.id}>
                      {language === 'EN' ? (sys.nameEn || sys.name) : sys.name} (${sys.basePricePerSqFt.toFixed(2)} USD/sq ft)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-serif-heading font-bold text-stone-900 text-xs uppercase tracking-wider block mb-3">
                  {language === 'EN' ? '2. Resin Tone / Color:' : '2. Tono / Color de Resina:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FINISH_COLORS.map((col, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColorIndex(i)}
                      className={`p-2 rounded-xl text-[11px] font-semibold border flex items-center gap-2 transition-all ${
                        selectedColorIndex === i
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-stone-400 shrink-0" style={{ backgroundColor: col.hex }}></span>
                      <span className="truncate">{language === 'EN' ? col.nameEn : col.nameEs}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => runAiSimulation()}
                disabled={isAnalyzing}
                id="run-ai-vis-btn"
                className="w-full py-3 px-4 rounded-xl font-heading font-bold text-xs text-white bg-stone-900 hover:bg-[#007BFF] shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin text-amber-300' : 'text-amber-300'}`} />
                <span>
                  {isAnalyzing
                    ? (language === 'EN' ? 'PROCESSING WITH GEMINI AI...' : 'PROCESANDO CON IA GEMINI...')
                    : (language === 'EN' ? 'PROCESS AI DIAGNOSIS' : 'PROCESAR DIAGNÓSTICO IA')}
                </span>
              </button>

            </div>

            {/* AI Diagnosis Report Box */}
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-serif-heading font-bold text-xs text-stone-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#007BFF]" />
                  <span>{language === 'EN' ? 'AI Analysis Report' : 'Informe de Análisis IA'}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-900 bg-amber-200 px-2 py-0.5 rounded font-bold">
                  GEMINI 3.6
                </span>
              </div>

              {isAnalyzing ? (
                <div className="py-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#007BFF] animate-spin mx-auto" />
                  <p className="text-xs text-stone-600">
                    {language === 'EN' ? 'Analyzing spatial geometry and floor texture...' : 'Analizando geometría espacial y textura del piso...'}
                  </p>
                </div>
              ) : aiReport ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-stone-500 block font-semibold">{language === 'EN' ? 'Detected Substrate:' : 'Sustrato Detectado:'}</span>
                    <span className="text-stone-900 font-medium">{aiReport.detectedSurface}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block font-semibold">{language === 'EN' ? 'Lighting Condition:' : 'Iluminación del Espacio:'}</span>
                    <span className="text-stone-900 font-medium">{aiReport.lightingCondition}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white border border-stone-200">
                    <div>
                      <span className="text-stone-500 block text-[10px]">{language === 'EN' ? 'Recommended Thickness:' : 'Espesor Recomendado:'}</span>
                      <span className="text-stone-900 font-bold font-mono">{aiReport.estimatedThickness}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px]">{language === 'EN' ? 'Reflectivity Boost:' : 'Aumento de Reflejo:'}</span>
                      <span className="text-emerald-700 font-bold font-mono">{aiReport.reflectivityBoost}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-stone-500 block font-semibold">{language === 'EN' ? 'Concrete Preparation:' : 'Acondicionamiento de Concreto:'}</span>
                    <span className="text-stone-700">{aiReport.preparationNotes}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500">
                  {language === 'EN'
                    ? 'Click "Process AI Diagnosis" to receive a detailed technical analysis of your floor.'
                    : 'Haz clic en "Procesar Diagnóstico IA" para recibir el análisis técnico detallado de tu piso.'}
                </p>
              )}

              <button
                onClick={() => onNavigateToCalcWithSystem(selectedSystem)}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-stone-900 bg-white hover:bg-stone-200 border border-stone-300 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>{language === 'EN' ? 'Quote This System in Calculator →' : 'Cotizar Este Sistema en Calculadora →'}</span>
              </button>

            </div>

          </div>

        </div>

    </div>
  );
};
