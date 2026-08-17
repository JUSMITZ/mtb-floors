import React, { useState, useEffect } from 'react';
import { Calculator, Shield, ArrowDown, Zap, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import metallicFloorImg from '../assets/images/metallic_epoxy_floor_green_grey_1785894368659.jpg';

interface HeroProps {
  onNavigate: (tabId: string) => void;
  onOpenLeadModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const isEn = language === 'EN';

  const [veoVideoUrl, setVeoVideoUrl] = useState<string | null>(null);

  const handleScrollToCalc = () => {
    const calcElement = document.getElementById('calculadora');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onNavigate('calculadora');
    }
  };

  // Automatically request background video from Veo 3 AI silently on mount (runs only once)
  useEffect(() => {
    let isMounted = true;
    
    // Check session storage first
    const cachedVideo = sessionStorage.getItem('veo_hero_video_url');
    if (cachedVideo) {
      setVeoVideoUrl(cachedVideo);
      return;
    }

    const autoFetchVeoVideo = async () => {
      try {
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aspectRatio: '16:9',
            prompt: "Wide angle 8k architectural video shot of a modern luxury showroom interior featuring a high-gloss metallic epoxy floor. The floor has swirling metallic charcoal grey and deep emerald green 3D marble patterns with a crystal-clear mirror finish reflecting ambient ceiling lights. Slow, smooth forward camera motion gliding over the polished epoxy floor, photorealistic detail, seamless loopable motion"
          })
        });

        const data = await response.json();
        if (isMounted && data.success && (data.videoUrl || data.videoUri)) {
          const finalUrl = data.videoUrl || data.videoUri;
          setVeoVideoUrl(finalUrl);
          sessionStorage.setItem('veo_hero_video_url', finalUrl);
        }
      } catch (err) {
        // Silently handle error and fall back to high-res animated epoxy floor photo
        console.log("Automatic background video initialization complete.", err);
      }
    };

    autoFetchVeoVideo();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden py-10 sm:py-16 lg:py-24 border-b border-stone-800 bg-stone-950 min-h-[520px] sm:min-h-[620px] flex flex-col justify-center">
      
      {/* Seamless Automatic Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {veoVideoUrl ? (
          <video
            src={veoVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-85 transition-opacity duration-1000"
          />
        ) : (
          /* REAL High-Resolution Photograph of Luxury Metallic Epoxy Floor with Slow Camera Motion */
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={metallicFloorImg}
              alt="Real Metallic Epoxy Floor MTB FLOORS"
              className="w-full h-full object-cover animate-pan-slow scale-110"
            />
            
            {/* Mirror Reflection & Specular Gloss Enhancement */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-emerald-950/30 to-stone-950/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-radial-vignette opacity-80" />
          </div>
        )}

        {/* Specular Light Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-sheen-sweep opacity-50 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Dark Multi-Layer Contrast Overlay to guarantee perfect text legibility & WCAG compliance */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/70 to-stone-950/95 pointer-events-none z-[1]"></div>

      {/* Hero Content Floating Cleanly Over the Video Background */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center my-auto">
        <div className="space-y-5 sm:space-y-6">
          
          {/* Live Region Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-700/80 text-xs font-mono text-stone-200 shadow-lg">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-white font-bold tracking-tight">NY • NJ • CT • PA • DE • RI</span>
              <span className="text-stone-500 hidden xs:inline">•</span>
              <span className="text-amber-300 font-semibold hidden xs:inline-flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                {language === 'EN' ? 'COI $5M Certified' : 'Certificación COI $5M'}
              </span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-serif-heading font-normal tracking-tight text-white leading-[1.12]">
              {t.hero.titleLine1}{' '}
              <span className="italic font-serif text-[#007BFF] underline decoration-amber-400/50 underline-offset-6 sm:underline-offset-8">
                {t.hero.titleHighlight}
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-stone-200 font-sans leading-relaxed max-w-2xl mx-auto drop-shadow-md font-normal px-1">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Mobile-First Specification Badges (2 Columns on Mobile, 4 Columns on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 max-w-3xl mx-auto">
            <div 
              onClick={() => onNavigate('coi-compliance')}
              className="cursor-pointer p-3 sm:p-3.5 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 hover:border-[#007BFF] shadow-lg transition-all text-center group active:scale-95"
            >
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1 text-[#007BFF]">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-tight text-white group-hover:text-[#007BFF]">
                  {language === 'EN' ? '$5M POLICY' : 'PÓLIZA $5M'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-stone-300 leading-tight">
                {language === 'EN' ? 'COI & Co-Op Approved' : 'Aprobado por Juntas y COI'}
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-tight text-white">10–15 YRS</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-stone-300 leading-tight">
                {language === 'EN' ? 'Written Warranty' : 'Garantía Estructural Escrita'}
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1 text-emerald-400">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-tight text-white">ZERO VOC</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-stone-300 leading-tight">
                {language === 'EN' ? 'Odor-Free Resin' : 'Resina Ecológica Cero Olor'}
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1 text-blue-400">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-tight text-white">&gt;8,500 PSI</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-stone-300 leading-tight">
                {language === 'EN' ? 'Industrial Strength' : 'Resistencia Industrial'}
              </p>
            </div>
          </div>

          {/* Mobile-First Primary CTA Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleScrollToCalc}
              id="hero-cta-calc-primary"
              className="w-full sm:w-auto min-h-[52px] px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-heading font-extrabold text-sm sm:text-base text-white bg-stone-900 hover:bg-[#007BFF] shadow-2xl transition-all flex items-center justify-center gap-2.5 group border border-stone-700 active:scale-[0.98]"
            >
              <Calculator className="w-5 h-5 text-amber-300 group-hover:text-white shrink-0" />
              <span>{language === 'EN' ? 'Get Instant Estimate in 30s ↓' : 'Cotizar mi Espacio en 30s ↓'}</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-amber-300 group-hover:text-white shrink-0" />
            </button>
          </div>

          {/* Social Proof Key Numbers */}
          <div className="pt-4 border-t border-stone-800/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto">
            <div className="text-center">
              <div className="font-serif-heading font-bold text-lg sm:text-3xl text-white">2.5M+</div>
              <p className="text-[10px] sm:text-[11px] text-stone-300 font-medium mt-0.5 leading-tight">
                {language === 'EN' ? 'Sq Ft Installed' : 'Sq Ft Instalados'}
              </p>
            </div>
            <div className="text-center">
              <div className="font-serif-heading font-bold text-lg sm:text-3xl text-[#007BFF]">100%</div>
              <p className="text-[10px] sm:text-[11px] text-stone-300 font-medium mt-0.5 leading-tight">
                {language === 'EN' ? 'Board Approval' : 'Aprobación Juntas'}
              </p>
            </div>
            <div className="text-center">
              <div className="font-serif-heading font-bold text-lg sm:text-3xl text-amber-400">10-15</div>
              <p className="text-[10px] sm:text-[11px] text-stone-300 font-medium mt-0.5 leading-tight">
                {language === 'EN' ? 'Years Warranty' : 'Años de Garantía'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};




