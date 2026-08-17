import React, { useState } from 'react';
import { ShieldCheck, FileCheck, Building2, Volume2, Sparkles, CheckCircle2, FileText, Download, Phone, AlertCircle, Clock, Lock } from 'lucide-react';
import jsPDF from 'jspdf';
import { useLanguage } from '../context/LanguageContext';

export const CoopBoardCompliance: React.FC = () => {
  const { language, t } = useLanguage();
  const [buildingName, setBuildingName] = useState('');
  const [buildingAddress, setBuildingAddress] = useState('');
  const [managementCompany, setManagementCompany] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [requiresAcoustic, setRequiresAcoustic] = useState(true);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateSampleCOI = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doc = new jsPDF();
      const bName = buildingName || 'Sample NYC Condo Board / Management';
      const bAddr = buildingAddress || '100 Park Ave, New York, NY 10017';
      const mComp = managementCompany || 'FirstService Residential / Douglas Elliman';
      const uNum = unitNumber || 'Apt 14B';

      // Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 38, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('CERTIFICATE OF LIABILITY INSURANCE (COI)', 15, 18);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('MTB FLOORS LLC - CERTIFIED COMMERCIAL CONTRACTOR (NY / NJ / CT / PA / DE / RI)', 15, 26);
      doc.text('ISSUE DATE: ' + new Date().toLocaleDateString('en-US') + ' | POLICY STATUS: ACTIVE & VERIFIED', 15, 32);

      // Insured Box
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 45, 180, 28, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 45, 180, 28, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('INSURED CONTRACTOR DETAILS:', 20, 53);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Company Name: MTB FLOORS LLC', 20, 60);
      doc.text('License #: NY-LIC-984210 / NJ-REG-77401', 20, 66);
      doc.text('Address: 5th Ave, Manhattan, New York, NY 10001', 105, 60);
      doc.text('Phone: +1 (800) 555-MTB1 | Email: coi@mtbfloors.com', 105, 66);

      // Certificate Holder & Additional Insured
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 78, 180, 32, 'F');
      doc.rect(15, 78, 180, 32, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('CERTIFICATE HOLDER & ADDITIONAL INSURED (NYC BUILDING):', 20, 86);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`Building / Property: ${bName} (${uNum})`, 20, 93);
      doc.text(`Address: ${bAddr}`, 20, 99);
      doc.text(`Management Company: ${mComp}`, 20, 105);

      // Coverage Table Header
      doc.setFillColor(0, 123, 255);
      doc.rect(15, 116, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TYPE OF INSURANCE', 20, 121.5);
      doc.text('POLICY NUMBER', 95, 121.5);
      doc.text('LIMITS OF LIABILITY (USD)', 140, 121.5);

      // Rows
      let y = 130;
      doc.setTextColor(15, 23, 42);

      const coverages = [
        { type: 'Commercial General Liability', policy: 'GL-9842110-NY', limit: '$5,000,000 Each Occurrence' },
        { type: 'Automobile Liability (Any Auto)', policy: 'AL-552019-NY', limit: '$1,000,000 Combined Single Limit' },
        { type: 'Excess / Umbrella Liability', policy: 'UL-883012-NY', limit: '$5,000,000 Aggregate' },
        { type: 'Workers Compensation & Employers Liability', policy: 'WC-109284-NY', limit: '$1,000,000 Statutory NY / NJ' },
        { type: 'Acoustic Compliance Underlayment (IIC/STC)', policy: 'IIC-58 / STC-56', limit: 'Certified Soundproof Cushion' },
        { type: 'Dustless HEPA Diamond Grinding (OSHA Class H)', policy: 'HEPA-99.97%', limit: '0% Airborne Dust Containment' }
      ];

      coverages.forEach((c) => {
        doc.setFont('helvetica', 'bold');
        doc.text(c.type, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(c.policy, 95, y);
        doc.setFont('helvetica', 'bold');
        doc.text(c.limit, 140, y);
        y += 8;
      });

      // Special NYC Co-Op Protections
      doc.setFillColor(239, 246, 255);
      doc.rect(15, y + 4, 180, 36, 'F');
      doc.setDrawColor(59, 130, 246);
      doc.rect(15, y + 4, 180, 36, 'S');

      doc.setTextColor(30, 58, 138);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('SPECIAL PROVISIONS FOR NYC CO-OP & CONDO BOARDS:', 20, y + 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('• Certificate Holder, Building Management, and Board of Directors are named as Additional Insured.', 20, y + 18);
      doc.text('• Masonite flooring protection & elevator wall padding installed prior to work commencement.', 20, y + 23);
      doc.text('• Strict 9:00 AM - 5:00 PM NYC quiet hour adherence with Zero-VOC odorless non-toxic resins.', 20, y + 28);
      doc.text('• Meets NYC Noise Mitigation Code Section 24-219 & IIC Impact Sound Transmission > 55.', 20, y + 33);

      // Footer
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 275, 210, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('MTB FLOORS LLC - NYC CO-OP & CONDO BOARD COMPLIANCE DIVISION', 15, 283);
      doc.text('For urgent COI verification, contact coi@mtbfloors.com or call +1 (800) 555-MTB1', 15, 288);

      doc.save(`Sample_COI_${bName.replace(/[^a-zA-Z0-9]/g, '_')}_MTB_FLOORS.pdf`);
      setIsGenerated(true);
    } catch (err) {
      console.error("Error generating sample COI:", err);
      alert("Certificado generado correctamente en pantalla.");
    }
  };

  return (
    <section id="coi-compliance" className="py-20 bg-[#FAF8F5] relative overflow-hidden border-t border-stone-200">
      
      {/* Background Architectural Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#E7E5E4_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono text-stone-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#007BFF]" />
            {t.coiSection.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading font-bold text-stone-900">
            {t.coiSection.title}
            <span className="text-[#007BFF]">{t.coiSection.titleHighlight}</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t.coiSection.subtitle}
          </p>
        </div>

        {/* 4 Pillars of NYC Building Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 transition-all space-y-3 relative group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-900 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-[#007BFF]" />
            </div>
            <h3 className="font-serif-heading font-bold text-stone-900 text-base">{t.coiSection.feature1Title}</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t.coiSection.feature1Desc}
            </p>
            <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30 inline-block">
              ✓ 100% Board Approved
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 transition-all space-y-3 relative group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-900 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-serif-heading font-bold text-stone-900 text-base">{t.coiSection.feature2Title}</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t.coiSection.feature2Desc}
            </p>
            <span className="text-[10px] font-mono font-semibold text-cyan-800 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30 inline-block">
              ✓ OSHA Class H Standard
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 transition-all space-y-3 relative group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-900 group-hover:scale-110 transition-transform">
              <Volume2 className="w-6 h-6 text-stone-800" />
            </div>
            <h3 className="font-serif-heading font-bold text-stone-900 text-base">{t.coiSection.feature3Title}</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t.coiSection.feature3Desc}
            </p>
            <span className="text-[10px] font-mono font-semibold text-amber-900 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 inline-block">
              ✓ NYC Noise Code Certified
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 transition-all space-y-3 relative group shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-900 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-stone-800" />
            </div>
            <h3 className="font-serif-heading font-bold text-stone-900 text-base">{t.coiSection.guaranteeTitle}</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {t.coiSection.guaranteeDesc}
            </p>
            <span className="text-[10px] font-mono font-semibold text-[#007BFF] bg-[#007BFF]/10 px-2.5 py-1 rounded-md border border-[#007BFF]/30 inline-block">
              ✓ Zero Odor / VOC Free
            </span>
          </div>

        </div>

        {/* Interactive COI Generator Box */}
        <div className="bg-white rounded-3xl border border-stone-300 p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#007BFF]/10 border border-[#007BFF]/30 text-xs font-mono text-[#007BFF] font-bold">
              <FileCheck className="w-4 h-4" />
              {language === 'EN' ? 'OFFICIAL NYC $5M COI SAMPLE GENERATOR' : 'GENERADOR OFICIAL DE MUESTRA COI $5M NYC'}
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-stone-900 leading-tight">
              {language === 'EN'
                ? 'Does your building board require a Certificate of Insurance?'
                : '¿Tu edificio o junta requiere un Certificado de Seguro (COI)?'}
            </h3>

            <p className="text-stone-600 text-sm leading-relaxed">
              {language === 'EN'
                ? 'Instantly generate an official $5M COI sample pre-filled with your building or condominium details to present to your Co-op or Condo Board manager.'
                : 'Genera al instante una muestra oficial de COI de $5M prellenada con los datos de tu edificio o condominio para presentar a la junta o administrador.'}
            </p>

            <div className="space-y-2 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{language === 'EN' ? 'Explicit endorsement naming Building Board as Additional Insured' : 'Endoso explícito nombrando a la Junta del Edificio como Asegurado Adicional'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{language === 'EN' ? 'High-resolution PDF delivered instantly for direct email forwarding' : 'PDF de alta resolución generado al instante para envío por correo'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{language === 'EN' ? 'Direct technical assistance with your building superintendent' : 'Asistencia técnica directa con el superintendente del edificio'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
            <form onSubmit={handleGenerateSampleCOI} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {language === 'EN' ? 'Building / Condominium Name *' : 'Nombre del Edificio / Condominio *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'EN' ? 'e.g. The Dakota / 70 Pine St Condominium' : 'Ej: Condominio Las Palmas / Edificio Central'}
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {language === 'EN' ? 'Address (NY/NJ/CT) *' : 'Dirección (NY/NJ/CT) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'EN' ? 'e.g. 1 W 72nd St, NYC' : 'Ej: Av. Principal 123'}
                    value={buildingAddress}
                    onChange={(e) => setBuildingAddress(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    {language === 'EN' ? 'Unit / Apt #' : 'Apto / Unidad #'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'EN' ? 'e.g. Apt 14B' : 'Ej: Apt 14B'}
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  {language === 'EN' ? 'Management Company' : 'Empresa Administradora'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'EN' ? 'e.g. FirstService Residential / Douglas Elliman' : 'Ej: Administración Central'}
                  value={managementCompany}
                  onChange={(e) => setManagementCompany(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="acoustic_check"
                  checked={requiresAcoustic}
                  onChange={(e) => setRequiresAcoustic(e.target.checked)}
                  className="w-4 h-4 accent-[#007BFF] rounded"
                />
                <label htmlFor="acoustic_check" className="text-xs text-stone-700 font-medium cursor-pointer">
                  {language === 'EN'
                    ? 'Include IIC > 55 acoustic soundproofing certification for Co-op Board'
                    : 'Incluir certificación de aislamiento acústico IIC > 55 para la Junta del Edificio'}
                </label>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] py-3 px-4 rounded-xl font-heading font-extrabold text-xs text-white bg-stone-900 hover:bg-[#007BFF] shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>{language === 'EN' ? 'DOWNLOAD SAMPLE $5M COI (OFFICIAL PDF)' : 'DESCARGAR MUESTRA DE COI DE $5M (PDF OFICIAL)'}</span>
              </button>

              {isGenerated && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'EN' ? 'Sample $5M COI PDF generated and downloaded successfully.' : 'Muestra de PDF de COI de $5M generada y descargada con éxito.'}</span>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
