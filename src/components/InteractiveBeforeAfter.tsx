import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal, CheckCircle2, Sliders, ShieldCheck, Layers, Eye, Sun, Moon } from 'lucide-react';
import { SystemType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TransformationPreset {
  id: string;
  title: string;
  titleEn?: string;
  location: string;
  borough: string;
  systemName: string;
  systemNameEn?: string;
  systemId: SystemType;
  beforeImg: string;
  afterImg: string;
  description: string;
  descriptionEn?: string;
  specularGloss: number;
  iicRating: string;
  iicRatingEn?: string;
  thickness: string;
}

const TRANSFORMATIONS: TransformationPreset[] = [
  {
    id: 'soho-loft',
    title: 'Soho Loft Industrial',
    titleEn: 'Soho Industrial Loft',
    location: 'Greene St, Manhattan',
    borough: 'Soho, NYC',
    systemName: 'Alto Brillo Espejo (100% Sólidos)',
    systemNameEn: 'High Gloss Mirror Resin (100% Solids)',
    systemId: 'high_gloss',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Transformación de piso de concreto agrietado de 1,800 sq ft en loft de Soho. Eliminación de manchas con desbaste diamantado y aplicación de recubrimiento blanco porcelana alto brillo.',
    descriptionEn: '1,800 sq ft cracked concrete floor transformation in a Soho loft. Stain removal via diamond grinding and application of porcelain white high-gloss resin.',
    specularGloss: 98,
    iicRating: 'IIC 58 (Con Membrana)',
    iicRatingEn: 'IIC 58 (With Membrane)',
    thickness: '40 Mils (1.0 mm)'
  },
  {
    id: 'brooklyn-brownstone',
    title: 'Brownstone Basement Luxury',
    titleEn: 'Brownstone Luxury Basement',
    location: 'Brooklyn Heights, NY',
    borough: 'Brooklyn, NYC',
    systemName: 'Resina Epóxica Metálica 3D Marble',
    systemNameEn: '3D Metallic Marble Epoxy Resin',
    systemId: 'metallic_3d',
    beforeImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    description: 'Remodelación de sótano histórico en Brooklyn. Nivelación de humedad previa, tratamiento de eflorescencia y vertido de veteado metálico efecto mármol tridimensional negro cósmico y oro.',
    descriptionEn: 'Historic Brooklyn basement transformation. Prior moisture mitigation, efflorescence treatment, and pouring 3D metallic liquid marble in cosmic black and gold.',
    specularGloss: 95,
    iicRating: 'IIC 60 (Alta Atenuación)',
    iicRatingEn: 'IIC 60 (High Attenuation)',
    thickness: '80 Mils (2.0 mm)'
  },
  {
    id: 'tribeca-penthouse',
    title: 'Tribeca Penthouse Terrace & Garage',
    titleEn: 'Tribeca Penthouse Terrace & Garage',
    location: 'Franklin St, Manhattan',
    borough: 'Tribeca, NYC',
    systemName: 'Hojuelas Granitizadas Poliaspártica',
    systemNameEn: 'Polyaspartic Granite Vinyl Flakes',
    systemId: 'granite_flakes',
    beforeImg: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    description: 'Recubrimiento de alta resistencia UV e intemperie en terraza privada. Sistema de micro-hojuelas vinílicas gris granito con capa protectora poliaspártica antideslizante.',
    descriptionEn: 'High-weather and UV resistant coating on private outdoor terrace. Granite grey vinyl flake system with non-slip clear polyaspartic topcoat.',
    specularGloss: 88,
    iicRating: 'IIC 56 (Excede Código NYC)',
    iicRatingEn: 'IIC 56 (Exceeds NYC Code)',
    thickness: '60 Mils (1.5 mm)'
  },
  {
    id: 'meatpacking-showroom',
    title: 'Meatpacking Restaurant & Commercial',
    titleEn: 'Meatpacking Commercial Restaurant',
    location: 'Gansevoort St, Manhattan',
    borough: 'Meatpacking, NYC',
    systemName: 'Cuarzo Sanitario Antideslizante (FDA)',
    systemNameEn: 'Sanitary Anti-Slip Quartz (FDA)',
    systemId: 'anti_slip',
    beforeImg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
    description: 'Piso continuo monolítico higiénico para restaurante de alto tráfico. Cumple con normas de salubridad USDA/FDA y agarre antideslizante para personal y comensales.',
    descriptionEn: 'Hygienic monolithic seamless flooring for high-traffic restaurant. Fully compliant with USDA/FDA health codes and slip-resistant traction.',
    specularGloss: 75,
    iicRating: 'IIC 55 (Sanitary Approved)',
    iicRatingEn: 'IIC 55 (Sanitary Approved)',
    thickness: '120 Mils (3.0 mm)'
  }
];

interface InteractiveBeforeAfterProps {
  onNavigateToCalcWithSystem?: (systemId: SystemType) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const InteractiveBeforeAfter: React.FC<InteractiveBeforeAfterProps> = ({ 
  onNavigateToCalcWithSystem,
  onNavigateToSection 
}) => {
  const { language } = useLanguage();
  const [activePresetId, setActivePresetId] = useState<string>('soho-loft');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isLightingWarm, setIsLightingWarm] = useState<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPreset = TRANSFORMATIONS.find(t => t.id === activePresetId) || TRANSFORMATIONS[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div id="antes-despues-ny" className="space-y-6">
      
      {/* Preset Selection Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
        {TRANSFORMATIONS.map((preset) => {
          const isSelected = preset.id === activePresetId;
          const title = language === 'EN' ? preset.titleEn || preset.title : preset.title;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setActivePresetId(preset.id);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-md scale-105'
                  : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{title}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isSelected ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-600'
              }`}>
                {preset.borough}
              </span>
            </button>
          );
        })}
      </div>

        {/* Main Comparison Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Interactive Drag Stage */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-md space-y-4">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between text-xs font-mono text-stone-700 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span className="text-stone-900 font-bold">{selectedPreset.location}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLightingWarm(!isLightingWarm)}
                  className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-300 hover:border-stone-400 text-stone-800 flex items-center gap-1.5 transition-all"
                >
                  {isLightingWarm ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'EN' ? 'Warm Light (3000K)' : 'Luz Cálida (3000K)'}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{language === 'EN' ? 'Daylight (6500K)' : 'Luz Día (6500K)'}</span>
                    </>
                  )}
                </button>

                <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 font-bold">
                  {language === 'EN' ? 'Gloss' : 'Brillo'}: {selectedPreset.specularGloss}%
                </div>
              </div>
            </div>

            {/* Interactive Image Container */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full h-[360px] sm:h-[480px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-stone-200 shadow-inner group"
            >
              {/* After Image (Full Background) */}
              <img
                src={selectedPreset.afterImg}
                alt={`After ${selectedPreset.title}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                  isLightingWarm ? 'sepia-[0.25] brightness-105' : 'contrast-105'
                }`}
              />

              {/* After Label Badge */}
              <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-md text-white text-xs font-heading font-extrabold px-3.5 py-1.5 rounded-xl shadow-lg border border-stone-700 z-10 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'EN' ? 'AFTER' : 'DESPUÉS'}: {language === 'EN' ? selectedPreset.systemNameEn || selectedPreset.systemName : selectedPreset.systemName}</span>
              </div>

              {/* Before Image (Clipped Overlay) */}
              <div
                className="absolute top-0 bottom-0 left-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={selectedPreset.beforeImg}
                  alt={`Before ${selectedPreset.title}`}
                  className="absolute top-0 bottom-0 left-0 h-full max-w-none object-cover filter grayscale contrast-125"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                />

                {/* Before Label Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-heading font-bold px-3.5 py-1.5 rounded-xl border border-stone-300 z-10 shadow-md">
                  <span>{language === 'EN' ? 'BEFORE: Untreated Original Substrate' : 'ANTES: Sustrato Original Sin Tratar'}</span>
                </div>
              </div>

              {/* Draggable Divider Handle Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.4)] z-20 cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-stone-900 text-white border-2 border-white shadow-2xl flex items-center justify-center">
                  <MoveHorizontal className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
              </div>

            </div>

            {/* Hint text */}
            <div className="text-center text-xs font-mono text-stone-500 flex items-center justify-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-[#007BFF]" />
              <span>{language === 'EN' ? 'Drag white divider left/right to compare transformation' : 'Arrastra el divisor blanco izquierda/derecha para comparar la transformación'}</span>
            </div>

          </div>

          {/* Right Technical Specs Drawer */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-5">
            
            <div>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded font-bold uppercase">
                {selectedPreset.borough}
              </span>
              <h3 className="text-xl font-serif-heading font-bold text-stone-900 mt-1.5">
                {language === 'EN' ? selectedPreset.titleEn || selectedPreset.title : selectedPreset.title}
              </h3>
            </div>

            <p className="text-stone-600 text-xs leading-relaxed border-b border-stone-200 pb-4">
              {language === 'EN' ? selectedPreset.descriptionEn || selectedPreset.description : selectedPreset.description}
            </p>

            {/* Spec Cards */}
            <div className="space-y-3 font-mono text-xs">
              
              <div className="flex justify-between items-center p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500">{language === 'EN' ? 'Applied System:' : 'Sistema Aplicado:'}</span>
                <span className="text-[#007BFF] font-bold text-right">{language === 'EN' ? selectedPreset.systemNameEn || selectedPreset.systemName : selectedPreset.systemName}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500">{language === 'EN' ? 'Specular Gloss:' : 'Brillo Especular:'}</span>
                <span className="text-emerald-700 font-bold">{selectedPreset.specularGloss}% {language === 'EN' ? 'Mirror Reflection' : 'Reflejo Espejo'}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500">{language === 'EN' ? 'NYC Acoustic Code:' : 'Norma Acústica NYC:'}</span>
                <span className="text-stone-900 font-bold">{language === 'EN' ? selectedPreset.iicRatingEn || selectedPreset.iicRating : selectedPreset.iicRating}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500">{language === 'EN' ? 'Layer Thickness:' : 'Espesor Capa:'}</span>
                <span className="text-stone-900 font-bold">{selectedPreset.thickness}</span>
              </div>

            </div>

            {/* Call to action button */}
            {onNavigateToCalcWithSystem && (
              <button
                onClick={() => onNavigateToCalcWithSystem(selectedPreset.systemId)}
                className="w-full min-h-[46px] py-3 px-4 rounded-xl font-heading font-extrabold text-xs text-white bg-stone-900 hover:bg-[#007BFF] shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'EN' ? 'Quote This System in Sq Ft' : 'Cotizar Este Sistema en Sq Ft'}</span>
              </button>
            )}

          </div>

        </div>

    </div>
  );
};
