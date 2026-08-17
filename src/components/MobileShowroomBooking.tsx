import React, { useState } from 'react';
import { Truck, Calendar, MapPin, Clock, CheckCircle2, Sparkles, User, Phone, Mail, ShieldCheck, Layers, X, Send, Award, Shield } from 'lucide-react';
import { USState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import mtbVanCrewImg from '../assets/images/mtb_van_exact_cartoon_banner_1786327656068.jpg';

interface SampleKitOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const SAMPLE_KITS: Record<'EN' | 'ES', SampleKitOption[]> = {
  EN: [
    { id: 'mirror_gloss', name: 'Mirror Porcelain High-Gloss', description: 'Mirror white, titanium gray & piano black slab samples', icon: '✨' },
    { id: 'metallic_marble', name: '3D Metallic Lava Effect', description: 'Iridescent copper, gold, and pearl resin samples', icon: '🎨' },
    { id: 'granite_flakes', name: 'Vinyl Granite Flake Systems', description: 'Heavy-duty granite textured flakes for garages & terraces', icon: '💎' },
    { id: 'sanitary_quartz', name: 'Sanitary Anti-Slip Quartz', description: 'Industrial non-slip textured slabs (USDA / FDA grade)', icon: '🛡️' },
    { id: 'acoustic_pads', name: 'IIC/STC Soundproofing Membrane', description: 'Acoustic underlayment padding with noise test slabs', icon: '🔊' }
  ],
  ES: [
    { id: 'mirror_gloss', name: 'Alto Brillo & Espejo Porcelana', description: 'Muestras de blanco espejo, gris titanio y negro azabache', icon: '✨' },
    { id: 'metallic_marble', name: 'Resina Metálica Effect 3D', description: 'Muestras con pigmentos iridiscentes cobre, oro y perlado', icon: '🎨' },
    { id: 'granite_flakes', name: 'Hojuelas Vinílicas Granitizadas', description: 'Muestras de textura granito para garajes y terrazas', icon: '💎' },
    { id: 'sanitary_quartz', name: 'Cuarzo Antideslizante Sanitario', description: 'Muestras rugosas de grado comercial e industrial (USDA)', icon: '🛡️' },
    { id: 'acoustic_pads', name: 'Aislamiento Acústico IIC/STC', description: 'Muestras de membranas bajo-piso con prueba de ruido', icon: '🔊' }
  ]
};

interface MobileShowroomBookingProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const MobileShowroomBooking: React.FC<MobileShowroomBookingProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const sampleKits = SAMPLE_KITS[language];

  const [selectedKit, setSelectedKit] = useState<string>('metallic_marble');
  const [borough, setBorough] = useState<string>('Manhattan');
  const [state, setState] = useState<USState>('NY');
  const [address, setAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('Morning (9:00 AM - 12:00 PM)');
  
  // Client details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('Condo / Co-Op High-Rise');

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingCode, setBookingCode] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !address) {
      alert(language === 'EN' ? 'Please complete required fields: Name, Phone, and Address.' : 'Por favor complete los campos obligatorios: Nombre, Teléfono y Dirección.');
      return;
    }

    const code = `VAN-NY-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingCode(code);
    setIsSubmitted(true);

    // Send prefilled message to WhatsApp
    const kitObj = sampleKits.find(k => k.id === selectedKit);
    const message = `Hello MTB FLOORS, I just booked a Mobile Showroom Van Visit in NY (Code ${code}).\n\n` +
      `👤 Client: ${clientName}\n` +
      `📱 Phone: ${clientPhone}\n` +
      `📍 Address: ${address}, ${borough} (${state})\n` +
      `🏢 Property: ${propertyType}\n` +
      `📅 Date: ${preferredDate || 'TBD'} - ${timeSlot}\n` +
      `🎨 Sample Kit: ${kitObj?.name}\n\n` +
      `Please confirm the mobile van arrival to my property.`;

    const waUrl = `https://wa.me/13474844232?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="showroom-movil" className="py-20 bg-[#FAF8F5] relative overflow-hidden border-t border-stone-200">
      
      {/* Background Architectural Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#E7E5E4_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono text-stone-900 font-semibold">
            <Truck className="w-4 h-4 text-[#007BFF]" />
            {t.showroomSection.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading font-bold text-stone-900">
            {t.showroomSection.title}
            <span className="text-[#007BFF]">{t.showroomSection.titleHighlight}</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t.showroomSection.subtitle}
          </p>
        </div>

        {/* Main 2-Column Grid: Featured Van Showcase + Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: Featured Van & Crew Showcase Illustration */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-3 sm:p-4 rounded-3xl border border-stone-200 shadow-xl space-y-3">
              
              {/* Mobile-First Optimized Image Container with Touch Zoom Lightbox Trigger */}
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="group relative rounded-2xl overflow-hidden bg-[#0F172A] border border-stone-800 shadow-inner flex flex-col items-center justify-center p-1.5 sm:p-2.5 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-[#007BFF]/50"
              >
                <img 
                  src={mtbVanCrewImg} 
                  alt="MTB FLOORS Official Service Van & Crew" 
                  className="w-full h-auto max-h-[340px] xs:max-h-[380px] sm:max-h-[440px] md:max-h-[480px] lg:max-h-[420px] object-contain rounded-xl mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Mobile Touch Zoom Indicator Badge */}
                <div className="absolute top-3 right-3 bg-stone-900/85 backdrop-blur-md text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg group-hover:bg-[#007BFF] group-hover:text-white group-hover:border-transparent transition-colors">
                  <Sparkles className="w-3 h-3 text-amber-300 group-hover:text-white" />
                  <span>{language === 'EN' ? 'Tap to Zoom' : 'Toca para ampliar'}</span>
                </div>
              </div>

              {/* Clean Official State Coverage & Interactive Contact Buttons below Image */}
              <div className="text-center py-2.5 px-2 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                <p className="text-[11px] font-mono font-bold text-[#C58535] tracking-wide">
                  📍 {language === 'EN' ? 'Official Coverage' : 'Cobertura Oficial'}: NY • NJ • CT • PA • DE • RI
                </p>
                <div className="text-[11px] font-mono font-semibold text-stone-700 flex items-center justify-center gap-2.5 flex-wrap pt-0.5">
                  <a 
                    href="tel:13474844232" 
                    className="hover:text-[#007BFF] transition-colors flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-stone-200"
                  >
                    📱 (347) 484-4232
                  </a>
                  <a 
                    href="https://instagram.com/mtbfloors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#007BFF] transition-colors flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-stone-200"
                  >
                    📸 @mtbfloors
                  </a>
                  <a 
                    href="mailto:mtbfloors@hotmail.com" 
                    className="hover:text-[#007BFF] transition-colors flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-stone-200"
                  >
                    ✉️ mtbfloors@hotmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Showcase Benefits List */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-2">
                <Sparkles className="w-4 h-4 text-[#007BFF]" />
                <span>{language === 'EN' ? 'Showroom Unit Key Benefits' : 'Ventajas de la Unidad Móvil'}</span>
              </h3>
              
              <ul className="space-y-2.5 text-xs text-stone-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{language === 'EN' ? '100+ Physical Samples:' : 'Más de 100 Muestras Reales:'}</strong>{' '}
                    {language === 'EN' ? 'Mirror epoxy, 3D metallic lava, granite flakes & soundproof pads.' : 'Porcelana espejo, metálicos 3D, hojuelas granito y membranas bajo-piso.'}
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#007BFF] shrink-0 mt-0.5" />
                  <span>
                    <strong>{language === 'EN' ? 'On-Site COI Verification:' : 'Verificación de COI In-Situ:'}</strong>{' '}
                    {language === 'EN' ? '$5M insurance documents delivered for Co-Op & Condo boards.' : 'Procesamos la documentación de seguro $5M para la junta del edificio.'}
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>{language === 'EN' ? 'Direct On-Site Lighting Test:' : 'Prueba de Luz en tu Espacio:'}</strong>{' '}
                    {language === 'EN' ? 'Test pigments with your natural home lighting before installation.' : 'Prueba tonos y acabados con la luz real de tu espacio.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-300 p-6 sm:p-8 shadow-lg">
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmitBooking} className="space-y-7">
                
                {/* STEP 1: Select Kit Muestras */}
                <div className="space-y-3">
                  <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">1</span>
                    <span>{t.showroomSection.step1Title}:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sampleKits.map((kit) => {
                      const isSelected = selectedKit === kit.id;
                      return (
                        <button
                          type="button"
                          key={kit.id}
                          onClick={() => setSelectedKit(kit.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-600 text-stone-900 shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-xs text-stone-900 mb-0.5">
                            <span className="text-base">{kit.icon}</span>
                            <span>{kit.name}</span>
                          </div>
                          <p className="text-[10px] text-stone-600 leading-tight">
                            {kit.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: Location & Borough */}
                <div className="space-y-3">
                  <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">2</span>
                    <span>{t.showroomSection.step2Title}:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-stone-600 block mb-1">{t.showroomSection.stateLabel} *</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value as USState)}
                        className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-bold focus:outline-none"
                      >
                        <option value="NY">NY (New York)</option>
                        <option value="NJ">NJ (New Jersey)</option>
                        <option value="CT">CT (Connecticut)</option>
                        <option value="PA">PA (Pennsylvania)</option>
                        <option value="DE">DE (Delaware)</option>
                        <option value="RI">RI (Rhode Island)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-stone-600 block mb-1">{t.showroomSection.cityLabel} *</label>
                      <select
                        value={borough}
                        onChange={(e) => setBorough(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none"
                      >
                        <option value="Manhattan">Manhattan</option>
                        <option value="Brooklyn">Brooklyn</option>
                        <option value="Queens">Queens</option>
                        <option value="Staten Island">Staten Island</option>
                        <option value="Bronx">Bronx</option>
                        <option value="Westchester">Westchester / Long Island</option>
                        <option value="Jersey City / Hoboken">Jersey City / Hoboken (NJ)</option>
                        <option value="Greenwich / Stamford">Greenwich / Stamford (CT)</option>
                        <option value="Philadelphia">Philadelphia / Main Line (PA)</option>
                        <option value="Wilmington / Dover">Wilmington / Dover (DE)</option>
                        <option value="Providence / Newport">Providence / Newport (RI)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-stone-600 block mb-1">
                        {language === 'EN' ? 'Building Address / Unit *' : 'Dirección del Inmueble / Apto *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'EN' ? 'e.g. 432 Park Ave / Apt 22A' : 'Ej: Av. Principal 123 / Apto 4B'}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 3: Date & Time Slot */}
                <div className="space-y-3">
                  <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">3</span>
                    <span>{t.showroomSection.step3Title}:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-stone-600 block mb-1">
                        {language === 'EN' ? 'Preferred Date' : 'Fecha Preferida'}
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-stone-600 block mb-1">
                        {language === 'EN' ? 'Preferred Time Window' : 'Horario Preferido'}
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none"
                      >
                        <option value="Morning (9:00 AM - 12:00 PM)">{language === 'EN' ? 'Morning (9:00 AM - 12:00 PM)' : 'Mañana (9:00 AM - 12:00 PM)'}</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">{language === 'EN' ? 'Afternoon (1:00 PM - 4:00 PM)' : 'Tarde (1:00 PM - 4:00 PM)'}</option>
                        <option value="Evening (5:00 PM - 7:00 PM)">{language === 'EN' ? 'Evening (5:00 PM - 7:00 PM)' : 'Noche (5:00 PM - 7:00 PM)'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* STEP 4: Client Info */}
                <div className="space-y-3">
                  <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">4</span>
                    <span>{t.showroomSection.formTitle}:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder={t.showroomSection.nameLabel + ' *'}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                    />

                    <input
                      type="tel"
                      required
                      placeholder={t.showroomSection.phoneLabel + ' *'}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                    />

                    <input
                      type="email"
                      placeholder={t.showroomSection.emailLabel}
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[50px] py-3 px-6 rounded-2xl font-heading font-bold text-sm text-white bg-stone-900 hover:bg-[#007BFF] shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
                  >
                    <Truck className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                    <span>{t.showroomSection.submitBtn}</span>
                  </button>
                  
                  <p className="text-[11px] text-center text-stone-500 mt-2">
                    🔒 {t.showroomSection.guarantee}
                  </p>
                </div>

              </form>
            ) : (
              <div className="text-center space-y-6 py-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-mono text-emerald-800 font-bold uppercase tracking-widest">
                    {language === 'EN' ? 'Booking Confirmed Successfully!' : '¡Reserva Recibida con Éxito!'}
                  </span>
                  <h3 className="text-2xl font-serif-heading font-bold text-stone-900 mt-1">
                    {language === 'EN' ? 'Booking Reference' : 'Código de Agenda'}: {bookingCode}
                  </h3>
                </div>

                <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  {language === 'EN'
                    ? `Our technical specialist assigned to ${borough} (${state}) will contact you shortly to confirm exact arrival time of the sample van.`
                    : `Nuestro especialista técnico asignado para ${borough} (${state}) se pondrá en contacto contigo en breve para confirmar la hora exacta de llegada.`}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 font-bold text-xs hover:border-stone-400"
                  >
                    {language === 'EN' ? 'Modify or Book Another Visit' : 'Agendar Otra Visita o Modificar'}
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Fullscreen Mobile-First Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn">
          {/* Top Modal Controls Header */}
          <div className="w-full max-w-4xl flex items-center justify-between pb-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-serif-heading font-bold text-sm tracking-wide">
                MTB FLOORS • Showroom Móvil & Crew
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold px-3"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">{language === 'EN' ? 'Close' : 'Cerrar'}</span>
            </button>
          </div>

          {/* Centered High Resolution Full Image View */}
          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-stone-800 bg-[#0F172A] shadow-2xl p-2">
            <img 
              src={mtbVanCrewImg} 
              alt="MTB FLOORS Official Service Van & Crew - Full HD" 
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
          </div>

          {/* Bottom Lightbox Quick Action Buttons */}
          <div className="pt-4 flex items-center gap-3 flex-wrap justify-center text-xs font-mono">
            <a
              href="tel:13474844232"
              className="px-4 py-2 rounded-xl bg-[#007BFF] hover:bg-blue-600 text-white font-bold flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>(347) 484-4232</span>
            </a>
            <a
              href="https://wa.me/13474844232"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg"
            >
              <span>💬 WhatsApp Directo</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );

};
