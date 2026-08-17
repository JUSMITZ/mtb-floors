import React, { useState, useMemo } from 'react';
import { FLOORING_SYSTEMS, SUBSTRATE_OPTIONS } from '../data/systems';
import { SubstrateCondition, SystemType, LocationType, QuoteData, QuoteBreakdown, USState } from '../types';
import { Calculator, Download, Send, CheckCircle2, ShieldCheck, FileText, Sparkles, Building, Phone, Mail, User, MapPin, Tag, MessageSquare, Percent, Truck, Calendar, ChevronDown, FileCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import { useLanguage } from '../context/LanguageContext';

interface CalculatorProps {
  initialSystemId?: SystemType;
}

export const CalculatorSection: React.FC<CalculatorProps> = ({ initialSystemId }) => {
  const { language, t } = useLanguage();
  // Input State in Sq Ft
  const [squareFeet, setSquareFeet] = useState<number>(1200);
  const [substrate, setSubstrate] = useState<SubstrateCondition>('concrete_new');
  const [system, setSystem] = useState<SystemType>(initialSystemId || 'high_gloss');

  // Sync state if initialSystemId changes from catalog click
  React.useEffect(() => {
    if (initialSystemId) {
      setSystem(initialSystemId);
    }
  }, [initialSystemId]);
  const [location, setLocation] = useState<LocationType>('indoor');

  // Location & Client Info Form
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [state, setState] = useState<USState>('NY');
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [projectNotes, setProjectNotes] = useState<string>('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const [generatedQuoteId, setGeneratedQuoteId] = useState<string>('');

  // Selected System Object
  const selectedSystemObj = useMemo(() => {
    return FLOORING_SYSTEMS.find(s => s.id === system) || FLOORING_SYSTEMS[0];
  }, [system]);

  // Selected Substrate Object
  const selectedSubstrateObj = useMemo(() => {
    return SUBSTRATE_OPTIONS.find(s => s.id === substrate) || SUBSTRATE_OPTIONS[0];
  }, [substrate]);

  // Mathematical Calculation Logic with Volume Discount & Logistics Savings in Sq Ft
  const breakdown: QuoteBreakdown = useMemo(() => {
    const grossBaseCost = squareFeet * selectedSystemObj.basePricePerSqFt;

    // Volume Discount Logic:
    // < 500 sq ft: 0% discount
    // 500 sq ft to 2,000 sq ft: 10% discount on base materials & labor
    // > 2,000 sq ft: 18% discount
    let volumeDiscountPercent = 0;
    if (squareFeet > 2000) {
      volumeDiscountPercent = 18;
    } else if (squareFeet >= 500) {
      volumeDiscountPercent = 10;
    }

    const volumeDiscountAmount = Math.round(grossBaseCost * (volumeDiscountPercent / 100));
    const baseSystemCost = grossBaseCost - volumeDiscountAmount;

    // Substrate Logistics Discount Logic:
    // If substrate is 'concrete_cracked' or 'old_paint' AND surface > 1000 sq ft, extra prep cost decreases by 15%
    let prepRate = selectedSubstrateObj.extraPrepCostPerSqFt;
    const substratePrepDiscountApplied = (substrate === 'concrete_cracked' || substrate === 'old_paint') && squareFeet > 1000;
    if (substratePrepDiscountApplied) {
      prepRate = prepRate * 0.85;
    }
    const substratePrepCost = Math.round(squareFeet * prepRate);

    // Location Factor: Outdoor requires UV polyaspartic topcoat (+20% on base)
    const locationMultiplier = location === 'outdoor' ? 1.20 : 1.0;
    const locationFactorCost = Math.round(baseSystemCost * (locationMultiplier - 1.0));

    const subtotal = baseSystemCost + substratePrepCost + locationFactorCost;
    const estimatedTax = 0;
    const totalCost = Math.round(subtotal);
    const costPerSqFt = squareFeet > 0 ? Math.round((totalCost / squareFeet) * 100) / 100 : 0;

    // Days calculation: Base 1 day + 1 day per 1,200 sq ft + prep
    let estimatedDays = Math.ceil(squareFeet / 1200) + 1;
    if (substrate === 'existing_tiles' || substrate === 'old_paint') estimatedDays += 1;

    return {
      grossBaseCost,
      volumeDiscountPercent,
      volumeDiscountAmount,
      baseSystemCost,
      substratePrepCost,
      substratePrepDiscountApplied,
      locationFactorCost,
      subtotal,
      estimatedTax,
      totalCost,
      costPerSqFt,
      estimatedDays
    };
  }, [squareFeet, selectedSystemObj, selectedSubstrateObj, location, substrate]);

  // Get current or generated Quote Code
  const getQuoteCode = () => {
    if (generatedQuoteId) return generatedQuoteId;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return `MTB-US-${randomCode}`;
  };

  // Handle WhatsApp Business Notification with Prefilled Text
  const handleNotifyWhatsApp = () => {
    const code = getQuoteCode();
    if (!generatedQuoteId) setGeneratedQuoteId(code);

    const sysName = language === 'EN' ? (selectedSystemObj.nameEn || selectedSystemObj.name) : selectedSystemObj.name;
    const addrStr = streetAddress ? `${streetAddress}, ` : '';
    const locText = city ? `${addrStr}${city}, ${state}` : `${addrStr}${state} (Zip ${zipCode || 'N/A'})`;
    const message = language === 'EN'
      ? `Hello MTB FLOORS, I just generated quote ${code} for ${squareFeet} sq ft of the ${sysName} system in ${locText}. My estimated investment is $${breakdown.totalCost.toLocaleString('en-US')} USD. I would like to schedule an evaluation visit.`
      : `Hola MTB FLOORS, acabo de generar la cotización ${code} para ${squareFeet} sq ft del sistema ${sysName} en ${locText}. Mi presupuesto estimado es $${breakdown.totalCost.toLocaleString('en-US')} USD. Quisiera agendar la visita técnica de evaluación.`;
    const whatsappUrl = `https://wa.me/18005556821?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle PDF Generation
  const handleGeneratePDF = () => {
    try {
      const doc = new jsPDF();
      const quoteCode = getQuoteCode();
      if (!generatedQuoteId) setGeneratedQuoteId(quoteCode);

      // Brand Colors #0F172A Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 42, 'F');

      // Title & Brand
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('MTB FLOORS - PISOS DE MTB', 15, 20);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('HIGH-TECH RESIN & INDUSTRIAL EPOXY SYSTEMS (TRI-STATE & NORTHEAST REGION)', 15, 28);
      doc.text('OSHA COMPLIANT | USDA/FDA SANITARY | ADA SLIP-RESISTANT', 15, 34);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`CODE: ${quoteCode}`, 135, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`DATE: ${new Date().toLocaleDateString('en-US')}`, 135, 27);
      doc.text(`VALE UNTIL: 30 Days`, 135, 34);

      // Client Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 48, 180, 32, 3, 3, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('PROJECT & CLIENT DETAILS:', 20, 56);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Client: ${clientName || 'Valued Client'}`, 20, 63);
      doc.text(`Phone: ${clientPhone || 'Not specified'}`, 20, 69);
      doc.text(`Email: ${clientEmail || 'Not specified'}`, 110, 63);
      doc.text(`Address: ${streetAddress || 'Not specified'}`, 20, 75);
      doc.text(`Location: ${city || 'City'}, ${state} ${zipCode ? 'Zip: ' + zipCode : ''}`, 110, 69);

      const sysName = language === 'EN' ? (selectedSystemObj.nameEn || selectedSystemObj.name) : selectedSystemObj.name;
      const subName = language === 'EN' ? (selectedSubstrateObj.nameEn || selectedSubstrateObj.name) : selectedSubstrateObj.name;

      // Specifications Box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(language === 'EN' ? 'SYSTEM TECHNICAL SPECIFICATIONS' : 'ESPECIFICACIONES TÉCNICAS DEL SISTEMA', 15, 85);

      doc.setFillColor(15, 23, 42);
      doc.rect(15, 89, 180, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(`${language === 'EN' ? 'System:' : 'Sistema:'} ${sysName}`, 20, 96);
      doc.text(`${language === 'EN' ? 'Compressive Strength:' : 'Resistencia Comprensión:'} ${selectedSystemObj.psiStrength} PSI`, 20, 102);
      doc.text(`${language === 'EN' ? 'Nominal Thickness:' : 'Espesor Nominal:'} ${selectedSystemObj.thicknessMm}`, 20, 107);

      doc.text(`${language === 'EN' ? 'Written Warranty:' : 'Garantía Escrita:'} ${selectedSystemObj.warrantyYears} ${language === 'EN' ? 'Years' : 'Años'}`, 110, 96);
      doc.text(`${language === 'EN' ? 'Full Cure Time:' : 'Curado Total:'} ${selectedSystemObj.cureTimeHours} ${language === 'EN' ? 'Hours' : 'Horas'}`, 110, 102);
      doc.text(`${language === 'EN' ? 'Chemical Resistance:' : 'Resistencia Química:'} ${selectedSystemObj.chemicalResistance}`, 110, 107);

      // Specification Table Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(language === 'EN' ? 'INVESTMENT BREAKDOWN' : 'DESGLOSE DE INVERSIÓN', 15, 120);

      doc.setFillColor(0, 123, 255); // #007BFF
      doc.rect(15, 124, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(language === 'EN' ? 'ITEM / COMPONENT' : 'CONCEPTO / COMPONENTE', 20, 129.5);
      doc.text(language === 'EN' ? 'RATE / DETAILS' : 'TARIFA / DETALLES', 110, 129.5);
      doc.text(language === 'EN' ? 'SUBTOTAL (USD)' : 'SUBTOTAL (USD)', 160, 129.5);

      // Rows
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      let y = 138;

      // Row 1: Subtotal de Area Gross
      doc.text(`1. ${language === 'EN' ? 'Base Area Subtotal' : 'Subtotal Área Base'} (${sysName})`, 20, y);
      doc.text(`${squareFeet} sq ft x $${selectedSystemObj.basePricePerSqFt}/sq ft`, 110, y);
      doc.text(`$${breakdown.grossBaseCost.toLocaleString('en-US')}`, 160, y);
      y += 8;

      // Row 2: Volume Discount if applicable
      if (breakdown.volumeDiscountPercent > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129); // emerald
        doc.text(`2. ${language === 'EN' ? 'Industrial Volume Discount' : 'Descuento Volumen Industrial'} (-${breakdown.volumeDiscountPercent}%)`, 20, y);
        doc.text(`${language === 'EN' ? 'Volume tier for' : 'Tramo volumen'} ${squareFeet} sq ft`, 110, y);
        doc.text(`-$${breakdown.volumeDiscountAmount.toLocaleString('en-US')}`, 160, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        y += 8;
      }

      // Row 3: Substrate Prep
      doc.text(`3. ${language === 'EN' ? 'Substrate Prep & Profile' : 'Acondicionamiento Sustrato'} (${subName})`, 20, y);
      const prepNote = breakdown.substratePrepDiscountApplied 
        ? `+$${(selectedSubstrateObj.extraPrepCostPerSqFt * 0.85).toFixed(2)}/sq ft (-15%)`
        : `+$${selectedSubstrateObj.extraPrepCostPerSqFt}/sq ft`;
      doc.text(prepNote, 110, y);
      doc.text(`$${breakdown.substratePrepCost.toLocaleString('en-US')}`, 160, y);
      y += 8;

      // Row 4: Location UV
      doc.text(`4. ${language === 'EN' ? 'UV Protection Topcoat' : 'Tratamiento UV'} (${location === 'outdoor' ? (language === 'EN' ? 'Outdoor' : 'Exterior') : (language === 'EN' ? 'Indoor' : 'Interior')})`, 20, y);
      doc.text(location === 'outdoor' ? '+20% Polyaspartic Shield' : 'Standard Indoor', 110, y);
      doc.text(`$${breakdown.locationFactorCost.toLocaleString('en-US')}`, 160, y);
      y += 12;

      // Total Line Box
      doc.setFillColor(241, 245, 249);
      doc.rect(15, y, 180, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 123, 255);
      doc.text(`5. ${language === 'EN' ? 'TOTAL ESTIMATED INVESTMENT:' : 'INVERSIÓN TOTAL ESTIMADA:'}`, 20, y + 8);
      doc.text(`$${breakdown.totalCost.toLocaleString('en-US')} USD`, 150, y + 8);

      // Tech Terms & Warranties
      y += 20;
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('MTB FLOORS TERMS & COMPLIANCE:', 15, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      y += 5;
      doc.text(`• Written Warranty: ${selectedSystemObj.warrantyYears} Years against peeling and blistering.`, 15, y);
      y += 4.5;
      doc.text(`• Estimated Turnaround Time: ${breakdown.estimatedDays} Business Days.`, 15, y);
      y += 4.5;
      doc.text('• Quote includes 100% solids resin supply, diamond grinding CSP prep, labor, and topcoat.', 15, y);
      y += 4.5;
      doc.text('• Valid for 30 days from issuance.', 15, y);

      // Footer
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 275, 210, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('MTB FLOORS - HIGH-TECH INDUSTRIAL & LUXURY RESIN FLOORS', 15, 284);
      doc.text('Toll Free: +1 (800) 555-MTB1 | quotes@mtbfloors.com | www.pisosdemtb.com', 15, 289);

      doc.save(`Quote_${quoteCode}_MTB_FLOORS.pdf`);
    } catch (err) {
      console.error("Error generating quote PDF:", err);
      alert("Quote is ready on screen. You can download or notify directly via WhatsApp.");
    }
  };

  // Submit quote to server & trigger automatic flow
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert("Por favor ingrese al menos su Nombre y Teléfono para registrar su cotización.");
      return;
    }

    setIsSubmitting(true);
    try {
      const quoteData: QuoteData = {
        squareFeet,
        substrate,
        system,
        location,
        clientName,
        clientPhone,
        clientEmail,
        streetAddress,
        state,
        zipCode,
        city,
        projectNotes
      };

      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteData, quoteBreakdown: breakdown })
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedQuoteId(data.quoteId);
        setQuoteSuccess(true);
        handleGeneratePDF();
      }
    } catch (err) {
      console.error(err);
      const fallbackCode = getQuoteCode();
      setGeneratedQuoteId(fallbackCode);
      setQuoteSuccess(true);
      handleGeneratePDF();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculadora" className="py-20 bg-[#FAF8F5] relative border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-xs font-mono text-stone-900 font-semibold">
            <Calculator className="w-4 h-4 text-[#007BFF]" />
            {t.calculator.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading font-bold text-stone-900">
            {t.calculator.title} <span className="text-[#007BFF]">{t.calculator.titleHighlight}</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls (Variables A, B, C, D) */}
          <div className="lg:col-span-7 space-y-8 bg-white p-5 sm:p-8 rounded-3xl border border-stone-200 shadow-md">
            
            {/* VARIABLE A: Area Sq Ft Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">A</span>
                  <span>{language === 'EN' ? 'Variable A: Total Surface Area in Sq Ft' : 'Variable A: Superficie Total en Pies Cuadrados (Sq Ft)'}</span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={100}
                    max={50000}
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(Math.max(1, Number(e.target.value)))}
                    className="w-28 min-h-[44px] px-3 py-1 bg-stone-50 border border-stone-300 rounded-xl text-right font-mono text-sm text-[#007BFF] font-bold focus:outline-none"
                  />
                  <span className="text-xs text-stone-500 font-mono">sq ft</span>
                </div>
              </div>

              <input
                type="range"
                min={100}
                max={6000}
                step={50}
                value={squareFeet}
                onChange={(e) => setSquareFeet(Number(e.target.value))}
                className="w-full h-3 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />

              <div className="flex justify-between text-[11px] text-stone-500 font-mono pt-1">
                <span>100 sq ft ({language === 'EN' ? 'Residential Garage' : 'Garaje Residencial'})</span>
                <span>500 - 2,000 sq ft ({language === 'EN' ? '-10% Disc.' : '-10% Desc.'})</span>
                <span>+2,000 sq ft ({language === 'EN' ? '-18% Ind. Vol.' : '-18% Vol. Ind.'})</span>
              </div>

              {/* Dynamic Volume Discount Alert Banner */}
              {breakdown.volumeDiscountPercent > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 text-xs flex items-center gap-3 animate-fadeIn">
                  <Percent className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-800 uppercase tracking-wide">
                      {language === 'EN'
                        ? `Industrial Volume Discount Applied (-${breakdown.volumeDiscountPercent}%)`
                        : `Descuento por Volumen Industrial Aplicado (-${breakdown.volumeDiscountPercent}%)`}
                    </span>
                    <p className="text-[11px] text-stone-700 mt-0.5">
                      {language === 'EN' ? (
                        <>Automatic savings of <strong className="text-emerald-800">${breakdown.volumeDiscountAmount.toLocaleString('en-US')} USD</strong> on base materials & labor per sq ft.</>
                      ) : (
                        <>Ahorro automático de <strong className="text-emerald-800">${breakdown.volumeDiscountAmount.toLocaleString('en-US')} USD</strong> en tarifa base de materiales y mano de obra por sq ft.</>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* VARIABLE B: Substrate Condition */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">B</span>
                  <span>{language === 'EN' ? 'Variable B: Current Concrete Substrate Condition' : 'Variable B: Estado Actual del Sustrato de Concreto'}</span>
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {SUBSTRATE_OPTIONS.map((opt) => {
                  const isSelected = substrate === opt.id;
                  const isLogisticsDiscountApplied = (opt.id === 'concrete_cracked' || opt.id === 'old_paint') && squareFeet > 1000;
                  const name = language === 'EN' ? (opt.nameEn || opt.name) : opt.name;
                  const badge = language === 'EN' ? (opt.badgeEn || opt.badge) : opt.badge;
                  const prepDescription = language === 'EN' ? (opt.prepDescriptionEn || opt.prepDescription) : opt.prepDescription;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSubstrate(opt.id)}
                      className={`min-h-[52px] p-4 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs">{name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                          isSelected ? 'bg-stone-800 text-amber-300' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {isLogisticsDiscountApplied ? '+$' + (opt.extraPrepCostPerSqFt * 0.85).toFixed(2) + '/sq ft (-15%)' : badge}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-tight ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {prepDescription}
                      </p>

                      {isLogisticsDiscountApplied && (
                        <div className={`text-[10px] font-mono font-semibold ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                          {language === 'EN' ? '✓ 15% savings on equipment logistics (+1,000 sq ft)' : '✓ Ahorro del 15% en logística de maquinaria (+1,000 sq ft)'}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VARIABLE C: System Type */}
            <div className="space-y-3">
              <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">C</span>
                <span>{language === 'EN' ? 'Variable C: Selected Epoxy System' : 'Variable C: Sistema Epóxico Seleccionado'}</span>
              </label>

              <div className="space-y-2.5">
                {FLOORING_SYSTEMS.map((sys) => {
                  const isSelected = system === sys.id;
                  const name = language === 'EN' ? (sys.nameEn || sys.name) : sys.name;
                  const tagline = language === 'EN' ? (sys.taglineEn || sys.tagline) : sys.tagline;

                  return (
                    <div
                      key={sys.id}
                      onClick={() => setSystem(sys.id)}
                      className={`min-h-[54px] p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-600 text-stone-900 shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-amber-700 bg-stone-900' : 'border-stone-400'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-amber-300 rounded-full"></div>}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-stone-900">{name}</div>
                          <div className="text-[11px] text-stone-500">{tagline}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs shrink-0">
                        <span className="font-bold text-stone-900">${sys.basePricePerSqFt.toFixed(2)}</span> USD/sq ft
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VARIABLE D: Location (Indoor vs Outdoor) */}
            <div className="space-y-3">
              <label className="font-serif-heading font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center text-xs">D</span>
                <span>{language === 'EN' ? 'Variable D: Project Location' : 'Variable D: Ubicación del Proyecto'}</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocation('indoor')}
                  className={`min-h-[48px] p-3.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                    location === 'indoor'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {language === 'EN' ? '🏠 Indoor Standard (100% Solids)' : '🏠 Interior Standard (100% Sólidos)'}
                </button>
                <button
                  type="button"
                  onClick={() => setLocation('outdoor')}
                  className={`min-h-[48px] p-3.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                    location === 'outdoor'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {language === 'EN' ? '☀️ Outdoor (+ Polyaspartic UV Shield)' : '☀️ Exterior (+ Escudo Poliaspártico UV)'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Transparent Summary & Quotation Output */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Calculation Display Card */}
            <div className="bg-white border-2 border-stone-300 p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 relative overflow-hidden">

              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-800 font-bold tracking-widest uppercase">
                    {language === 'EN' ? 'TRANSPARENT US ESTIMATE' : 'ESTIMACIÓN TRANSPARENTE EE. UU.'}
                  </span>
                  <h3 className="font-serif-heading font-bold text-stone-900 text-xl">
                    {language === 'EN' ? 'Quote Summary' : 'Resumen de Cotización'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-900 font-mono text-xs font-bold border border-stone-300">
                    {getQuoteCode()}
                  </span>
                </div>
              </div>

              {/* Total Price Hero Box */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3">
                <span className="text-xs text-stone-500 font-medium">
                  {language === 'EN' ? 'Estimated Total Investment' : 'Inversión Total Estimada'}
                </span>
                <div className="text-4xl sm:text-5xl font-serif-heading font-bold text-stone-900 tracking-tight">
                  ${breakdown.totalCost.toLocaleString('en-US')} <span className="text-sm font-mono text-[#007BFF]">USD</span>
                </div>
                <div className="text-xs font-mono text-stone-600">
                  {language === 'EN' ? 'Average:' : 'Promedio:'} <span className="text-stone-900 font-bold">${breakdown.costPerSqFt.toFixed(2)} USD</span> / sq ft
                </div>

                {/* Conversion Funnel Immediate CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={handleNotifyWhatsApp}
                    className="w-full min-h-[44px] px-3 py-2.5 rounded-xl font-heading font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-600 shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                    <span>{language === 'EN' ? 'Send via WhatsApp / Email' : 'Enviar Presupuesto por WhatsApp / Email'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('showroom-movil');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full min-h-[44px] px-3 py-2.5 rounded-xl font-heading font-bold text-xs text-stone-900 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4 text-stone-900 shrink-0" />
                    <span>{language === 'EN' ? 'Book Mobile Showroom with Samples' : 'Agendar Showroom Móvil con Muestras'}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Technical Audit & Itemized Breakdown Accordion */}
              <details className="group border border-stone-200 rounded-2xl bg-stone-50 overflow-hidden transition-all">
                <summary className="p-3.5 cursor-pointer flex items-center justify-between font-serif-heading font-bold text-xs text-stone-900 hover:bg-stone-100 transition-colors select-none">
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#007BFF]" />
                    <span>
                      {language === 'EN'
                        ? 'Technical Audit & Itemized Breakdown (Optional View)'
                        : 'Informe Técnico & Desglose de Auditoría (Vista Opcional)'}
                    </span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-500 group-open:rotate-180 transition-transform" />
                </summary>

                <div className="p-4 border-t border-stone-200 space-y-2 text-xs bg-white">
                  
                  {/* 1. Subtotal Area */}
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-600">
                      {language === 'EN'
                        ? `1. Base Area Subtotal (${squareFeet} sq ft):`
                        : `1. Subtotal de Área Base (${squareFeet} sq ft):`}
                    </span>
                    <span className="font-mono text-stone-900 font-semibold">${breakdown.grossBaseCost.toLocaleString('en-US')} USD</span>
                  </div>

                  {/* 2. Descuento por Volumen (si aplica) */}
                  {breakdown.volumeDiscountPercent > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-stone-100 text-emerald-700">
                      <span className="font-semibold flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        {language === 'EN'
                          ? `2. Industrial Volume Discount (-${breakdown.volumeDiscountPercent}%):`
                          : `2. Descuento por Volumen Industrial (-${breakdown.volumeDiscountPercent}%):`}
                      </span>
                      <span className="font-mono font-bold">-${breakdown.volumeDiscountAmount.toLocaleString('en-US')} USD</span>
                    </div>
                  )}

                  {/* 3. Costo Acondicionamiento Sustrato */}
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-600 flex items-center gap-1">
                      {language === 'EN' ? '3. Substrate Prep Cost:' : '3. Costo Acondicionamiento Sustrato:'}
                      {breakdown.substratePrepDiscountApplied && (
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">(-15%)</span>
                      )}
                    </span>
                    <span className="font-mono text-stone-900 font-semibold">${breakdown.substratePrepCost.toLocaleString('en-US')} USD</span>
                  </div>

                  {/* 4. Tratamiento UV Exterior */}
                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-600">
                      {language === 'EN'
                        ? `4. UV Topcoat (${location === 'outdoor' ? 'Outdoor' : 'Indoor'}):`
                        : `4. Tratamiento UV (${location === 'outdoor' ? 'Exterior' : 'Interior'}):`}
                    </span>
                    <span className="font-mono text-stone-900 font-semibold">${breakdown.locationFactorCost.toLocaleString('en-US')} USD</span>
                  </div>

                  {/* Mechanical & Safety Specs */}
                  <div className="flex justify-between py-1.5 border-b border-stone-100 text-stone-700">
                    <span>{language === 'EN' ? 'Compressive Resistance:' : 'Resistencia Compresiva:'}</span>
                    <span className="font-mono font-bold text-stone-900">{selectedSystemObj.psiStrength}</span>
                  </div>

                  {/* Days & Warranties */}
                  <div className="flex justify-between py-1.5 font-bold text-stone-900 pt-1">
                    <span>{language === 'EN' ? 'Estimated Turnaround Time:' : 'Tiempo Estimado de Ejecución:'}</span>
                    <span className="font-mono text-[#007BFF]">
                      {breakdown.estimatedDays} {language === 'EN' ? 'Business Days' : 'Días Hábiles'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-stone-900">
                    <span>{language === 'EN' ? 'Official Written Warranty:' : 'Garantía Oficial por Escrito:'}</span>
                    <span className="font-mono text-emerald-700">
                      {selectedSystemObj.warrantyYears} {language === 'EN' ? 'Years' : 'Años'}
                    </span>
                  </div>

                </div>
              </details>

              {/* Customer Contact Form & State / Zip Selectors */}
              <form onSubmit={handleSubmitQuote} className="space-y-3 pt-2">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#007BFF]" />
                  <span>{language === 'EN' ? 'Contact details and project location:' : 'Datos de contacto y ubicación del proyecto:'}</span>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder={language === 'EN' ? 'Your Name *' : 'Tu Nombre *'}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full min-h-[46px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder={language === 'EN' ? 'Phone / WhatsApp *' : 'Teléfono / WhatsApp *'}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full min-h-[46px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder={language === 'EN' ? 'Email Address' : 'Correo Electrónico'}
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full min-h-[46px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                  />
                </div>

                {/* Street Address / Building Field (COI & Parking Verification) */}
                <div>
                  <label className="text-[11px] font-mono text-stone-700 font-semibold flex items-center gap-1.5 mb-1">
                    <Building className="w-3.5 h-3.5 text-[#007BFF]" />
                    <span>
                      {language === 'EN'
                        ? 'Building / Property Address (Optional - For COI & Parking Verification)'
                        : 'Dirección de Propiedad / Edificio (Opcional - Para COI y Estacionamiento)'}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={language === 'EN'
                        ? 'e.g. 450 Lexington Ave, Suite 1200, Manhattan (NYC COI Verification)'
                        : 'Ej. 450 Lexington Ave, Manhattan (Verificación COI NYC)'}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full min-h-[46px] pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                    />
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Mandatory State & Zip Code Row */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-stone-600 block mb-1">{language === 'EN' ? 'State *' : 'Estado *'}</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value as USState)}
                      className="w-full min-h-[44px] px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 font-bold focus:outline-none"
                    >
                      <option value="NY">NY (New York)</option>
                      <option value="NJ">NJ (New Jersey)</option>
                      <option value="PA">PA (Pennsylvania)</option>
                      <option value="CT">CT (Connecticut)</option>
                      <option value="DE">DE (Delaware)</option>
                      <option value="RI">RI (Rhode Island)</option>
                      <option value="Other">{language === 'EN' ? 'Other US State' : 'Otro Estado US'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-stone-600 block mb-1">{language === 'EN' ? 'Zip Code *' : 'Zip Code *'}</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="e.g. 10001"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:border-[#007BFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-stone-600 block mb-1">{language === 'EN' ? 'City' : 'Ciudad'}</label>
                    <input
                      type="text"
                      placeholder="e.g. NYC"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:border-[#007BFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="calc-submit-btn"
                    className="w-full min-h-[48px] py-3.5 px-4 rounded-xl font-heading font-extrabold text-xs text-white bg-stone-900 hover:bg-[#007BFF] shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? (language === 'EN' ? 'GENERATING TECHNICAL PDF...' : 'GENERANDO PDF TÉCNICO...')
                        : (language === 'EN' ? 'DOWNLOAD FORMAL PDF QUOTE (30-DAY VALIDITY)' : 'DESCARGAR COTIZACIÓN EN PDF (30 DÍAS VALIDEZ)')}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNotifyWhatsApp}
                    id="calc-whatsapp-direct-btn"
                    className="w-full min-h-[48px] py-3 px-4 rounded-xl font-heading font-extrabold text-xs text-white bg-emerald-700 hover:bg-emerald-600 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>{language === 'EN' ? 'NOTIFY & SEND VIA WHATSAPP' : 'NOTIFICAR Y ENVIAR POR WHATSAPP'}</span>
                  </button>
                </div>
              </form>

              {/* Confirmation Alert */}
              {quoteSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {language === 'EN'
                        ? `Quote Successfully Registered! Code: ${generatedQuoteId}`
                        : `¡Cotización Registrada con Éxito! Código: ${generatedQuoteId}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    {language === 'EN'
                      ? `Your 30-day valid PDF quote has been generated for ${squareFeet} sq ft in ${state}, with warranty breakdown (${selectedSystemObj.warrantyYears} years) and technical spec sheet (${selectedSystemObj.psiStrength} PSI).`
                      : `Se ha generado tu cotización en PDF con validez por 30 días para ${squareFeet} sq ft en ${state}, desglose de garantía (${selectedSystemObj.warrantyYears} años) y ficha técnica de resistencia (${selectedSystemObj.psiStrength} PSI).`}
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );

};

