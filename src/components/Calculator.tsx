import React, { useState, useMemo } from 'react';
import { FLOORING_SYSTEMS, SUBSTRATE_OPTIONS } from '../data/systems';
import { SubstrateCondition, SystemType, LocationType, QuoteData, QuoteBreakdown, USState } from '../types';
import { Calculator, Download, Send, CheckCircle2, ShieldCheck, FileText, Sparkles, Building, Phone, Mail, User, MapPin, Tag, MessageSquare, Percent, Truck, Calendar, ChevronDown, FileCheck, ArrowUpRight, DollarSign, Layers, Clock, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import { useLanguage } from '../context/LanguageContext';

interface CalculatorProps {
  initialSystemId?: SystemType;
}

// Utility function for currency formatting
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

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

  // Enhanced Mathematical Calculation Logic with Precise Pricing Tiers
  const breakdown: QuoteBreakdown = useMemo(() => {
    // BASE PRICING: Dynamic rate per sq ft ($4.00 - $11.50/sq ft) based on system selection
    const grossBaseCost = squareFeet * selectedSystemObj.basePricePerSqFt;

    // VOLUME DISCOUNT LOGIC - Automatic Tier Application:
    // Tier 1: < 500 sq ft → 0% discount (Residential/Small Commercial)
    // Tier 2: 500 - 2,000 sq ft → 10% discount (Medium Commercial)
    // Tier 3: > 2,000 sq ft → 18% discount (Industrial/Large Scale)
    let volumeDiscountPercent = 0;
    if (squareFeet > 2000) {
      volumeDiscountPercent = 18;
    } else if (squareFeet >= 500) {
      volumeDiscountPercent = 10;
    }

    const volumeDiscountAmount = Math.round(grossBaseCost * (volumeDiscountPercent / 100));
    const baseSystemCost = grossBaseCost - volumeDiscountAmount;

    // SUBSTRATE PREPARATION (Variable B) - Acondicionamiento del Sustrato:
    // Concrete Cracks: +$1.25/sq ft (V-groove + steel staples + epoxy filler)
    // Old Paint: +$1.00/sq ft (Heavy diamond grinding removal)
    // Ceramic Tile: +$1.75/sq ft (Glaze scarification + quartz tie-coat)
    // LOGISTICS DISCOUNT: If area > 1,000 sq ft and substrate requires prep, apply 15% savings
    let prepRate = selectedSubstrateObj.extraPrepCostPerSqFt;
    const substratePrepDiscountApplied = 
      (substrate === 'concrete_cracked' || substrate === 'old_paint' || substrate === 'existing_tiles') 
      && squareFeet > 1000;
    
    if (substratePrepDiscountApplied) {
      prepRate = prepRate * 0.85; // 15% logistics efficiency discount
    }
    const substratePrepCost = Math.round(squareFeet * prepRate);

    // LOCATION FACTOR (Variable D) - UV Protection Surcharge:
    // Outdoor applications require polyaspartic UV shield topcoat (+20% on base system cost)
    // This prevents yellowing and degradation from direct sunlight exposure
    const locationMultiplier = location === 'outdoor' ? 1.20 : 1.0;
    const locationFactorCost = Math.round(baseSystemCost * (locationMultiplier - 1.0));

    const subtotal = baseSystemCost + substratePrepCost + locationFactorCost;
    const estimatedTax = 0;
    const totalCost = Math.round(subtotal);
    const costPerSqFt = squareFeet > 0 ? Math.round((totalCost / squareFeet) * 100) / 100 : 0;

    // EXECUTION TIME CALCULATION:
    // Base: 1 day mobilization + 1 day per 1,200 sq ft installation capacity
    // Additional days for complex substrate prep (tiles, old paint)
    let estimatedDays = Math.ceil(squareFeet / 1200) + 1;
    if (substrate === 'existing_tiles' || substrate === 'old_paint') estimatedDays += 1;
    if (substrate === 'concrete_cracked' && squareFeet > 2000) estimatedDays += 1;

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

  // Enhanced WhatsApp Message Builder with Complete Lead Data
  const buildWhatsAppMessage = (): string => {
    const code = getQuoteCode();
    const sysName = language === 'EN' ? (selectedSystemObj.nameEn || selectedSystemObj.name) : selectedSystemObj.name;
    const subName = language === 'EN' ? (selectedSubstrateObj.nameEn || selectedSubstrateObj.name) : selectedSubstrateObj.name;
    
    // Build location string with full address details
    const addrParts: string[] = [];
    if (streetAddress) addrParts.push(streetAddress);
    if (city) addrParts.push(city);
    addrParts.push(`${state}${zipCode ? ` ${zipCode}` : ''}`);
    const locationStr = addrParts.join(', ');

    // Format currency values properly
    const totalFormatted = formatCurrency(breakdown.totalCost);
    const perSqFtFormatted = `$${breakdown.costPerSqFt.toFixed(2)}`;
    const savingsFormatted = breakdown.volumeDiscountAmount > 0 ? formatCurrency(breakdown.volumeDiscountAmount) : '$0';

    if (language === 'EN') {
      return `🏗️ *NEW QUOTE REQUEST - MTB FLOORS* 🏗️\n\n` +
        `📋 *Quote Code:* ${code}\n` +
        `📅 *Date:* ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n` +
        `👤 *CLIENT INFORMATION:*\n` +
        `• Name: ${clientName || 'Not provided'}\n` +
        `• Phone: ${clientPhone || 'Not provided'}\n` +
        `• Email: ${clientEmail || 'Not provided'}\n\n` +
        `📍 *PROJECT LOCATION:*\n` +
        `• Address: ${locationStr || 'To be confirmed'}\n\n` +
        `📐 *PROJECT SPECIFICATIONS:*\n` +
        `• Surface Area: ${squareFeet.toLocaleString('en-US')} sq ft\n` +
        `• System Selected: ${sysName}\n` +
        `• Substrate Condition: ${subName}\n` +
        `• Location Type: ${location === 'outdoor' ? '☀️ Outdoor (UV Protection Required)' : '🏠 Indoor Standard'}\n\n` +
        `💰 *INVESTMENT BREAKDOWN:*\n` +
        `• Total Estimated Cost: ${totalFormatted} USD\n` +
        `• Average Cost: ${perSqFtFormatted} / sq ft\n` +
        `• Volume Discount Applied: ${breakdown.volumeDiscountPercent}% (${savingsFormatted} saved)\n` +
        `• Substrate Prep: ${formatCurrency(breakdown.substratePrepCost)}\n` +
        `• UV Protection: ${location === 'outdoor' ? formatCurrency(breakdown.locationFactorCost) : '$0'}\n\n` +
        `⚙️ *TECHNICAL DETAILS:*\n` +
        `• Compressive Strength: ${selectedSystemObj.psiStrength} PSI\n` +
        `• Warranty: ${selectedSystemObj.warrantyYears} Years Written\n` +
        `• Est. Installation Time: ${breakdown.estimatedDays} Business Days\n\n` +
        `✅ I would like to schedule a technical evaluation visit and receive a formal on-site assessment.`;
    } else {
      return `🏗️ *NUEVA COTIZACIÓN - MTB FLOORS* 🏗️\n\n` +
        `📋 *Código de Cotización:* ${code}\n` +
        `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n` +
        `👤 *INFORMACIÓN DEL CLIENTE:*\n` +
        `• Nombre: ${clientName || 'No proporcionado'}\n` +
        `• Teléfono: ${clientPhone || 'No proporcionado'}\n` +
        `• Email: ${clientEmail || 'No proporcionado'}\n\n` +
        `📍 *UBICACIÓN DEL PROYECTO:*\n` +
        `• Dirección: ${locationStr || 'Por confirmar'}\n\n` +
        `📐 *ESPECIFICACIONES DEL PROYECTO:*\n` +
        `• Superficie: ${squareFeet.toLocaleString('en-US')} sq ft\n` +
        `• Sistema Seleccionado: ${sysName}\n` +
        `• Estado del Sustrato: ${subName}\n` +
        `• Tipo de Ubicación: ${location === 'outdoor' ? '☀️ Exterior (Protección UV Requerida)' : '🏠 Interior Estándar'}\n\n` +
        `💰 *DESGLOSE DE INVERSIÓN:*\n` +
        `• Costo Total Estimado: ${totalFormatted} USD\n` +
        `• Costo Promedio: ${perSqFtFormatted} / sq ft\n` +
        `• Descuento por Volumen: ${breakdown.volumeDiscountPercent}% (${savingsFormatted} ahorrados)\n` +
        `• Preparación Sustrato: ${formatCurrency(breakdown.substratePrepCost)}\n` +
        `• Protección UV: ${location === 'outdoor' ? formatCurrency(breakdown.locationFactorCost) : '$0'}\n\n` +
        `⚙️ *DETALLES TÉCNICOS:*\n` +
        `• Resistencia Compresiva: ${selectedSystemObj.psiStrength} PSI\n` +
        `• Garantía: ${selectedSystemObj.warrantyYears} Años por Escrito\n` +
        `• Tiempo Est. Instalación: ${breakdown.estimatedDays} Días Hábiles\n\n` +
        `✅ Quisiera agendar una visita técnica de evaluación y recibir una cotización formal en sitio.`;
    }
  };

  // Handle WhatsApp Business Notification with Enhanced Prefilled Text
  const handleNotifyWhatsApp = () => {
    const code = getQuoteCode();
    if (!generatedQuoteId) setGeneratedQuoteId(code);

    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/13474844232?text=${encodeURIComponent(message)}`;
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

              {/* Total Price Hero Box - Enhanced Visual Feedback */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/80 border-2 border-stone-200 text-center space-y-3 shadow-inner">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                    {language === 'EN' ? 'Estimated Total Investment' : 'Inversión Total Estimada'}
                  </span>
                </div>
                
                {/* Hero Total with Professional Formatting */}
                <div className="relative">
                  <div className="text-4xl sm:text-5xl font-serif-heading font-bold text-stone-900 tracking-tight">
                    {formatCurrency(breakdown.totalCost)} <span className="text-base font-mono text-[#007BFF]">USD</span>
                  </div>
                  
                  {/* Volume Discount Badge - Always Visible When Applied */}
                  {breakdown.volumeDiscountPercent > 0 && (
                    <div className="absolute -top-2 -right-2 sm:-right-4 animate-pulse">
                      <div className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        -{breakdown.volumeDiscountPercent}%
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Cost Per Sq Ft with Context */}
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-stone-600 bg-white/60 rounded-lg py-1.5 px-3 inline-flex mx-auto">
                  <Layers className="w-3.5 h-3.5 text-[#007BFF]" />
                  <span>
                    {language === 'EN' ? 'Avg:' : 'Prom:'} 
                    <span className="text-stone-900 font-bold ml-1">${breakdown.costPerSqFt.toFixed(2)} USD/sq ft</span>
                  </span>
                </div>

                {/* Savings Highlight Banner */}
                {breakdown.volumeDiscountAmount > 0 && (
                  <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-[10px] text-emerald-800 font-semibold">
                      🎉 {language === 'EN' ? 'You saved' : 'Ahorraste'} {formatCurrency(breakdown.volumeDiscountAmount)} {language === 'EN' ? 'with volume discount!' : 'con descuento por volumen!'}
                    </p>
                  </div>
                )}

                {/* Conversion Funnel Immediate CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-stone-200/80">
                  <button
                    type="button"
                    onClick={handleNotifyWhatsApp}
                    className="w-full min-h-[46px] px-3 py-2.5 rounded-xl font-heading font-bold text-xs text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{language === 'EN' ? 'Send Quote via WhatsApp' : 'Enviar Cotización por WhatsApp'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('showroom-movil');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full min-h-[46px] px-3 py-2.5 rounded-xl font-heading font-bold text-xs text-stone-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    <Truck className="w-4 h-4 text-stone-900 shrink-0 group-hover:translate-x-1 transition-transform" />
                    <span>{language === 'EN' ? 'Book Mobile Showroom' : 'Agendar Showroom Móvil'}</span>
                  </button>
                </div>
                
                {/* PDF Download CTA */}
                <button
                  type="button"
                  onClick={handleGeneratePDF}
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg font-heading font-bold text-xs text-stone-700 bg-white border-2 border-stone-300 hover:border-[#007BFF] hover:text-[#007BFF] shadow-sm transition-all flex items-center justify-center gap-2 group"
                >
                  <Download className="w-4 h-4 text-stone-500 group-hover:text-[#007BFF] transition-colors" />
                  <span>{language === 'EN' ? 'Download PDF Quote' : 'Descargar Cotización PDF'}</span>
                </button>
              </div>

              {/* Enhanced Collapsible Technical Audit & Itemized Breakdown Accordion */}
              <details className="group border-2 border-stone-200 rounded-2xl bg-gradient-to-br from-stone-50 to-white overflow-hidden transition-all shadow-sm">
                <summary className="p-4 cursor-pointer flex items-center justify-between font-serif-heading font-bold text-sm text-stone-900 hover:bg-stone-100/80 transition-colors select-none bg-gradient-to-r from-stone-100/50 to-transparent">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#007BFF]/10 flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-[#007BFF]" />
                    </div>
                    <div>
                      <span className="block text-xs font-medium text-stone-500 uppercase tracking-wide">
                        {language === 'EN' ? 'Full Transparency Guarantee' : 'Garantía de Transparencia Total'}
                      </span>
                      <span>
                        {language === 'EN'
                          ? 'Technical Audit & Itemized Breakdown'
                          : 'Informe Técnico & Desglose Detallado'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-all duration-300" />
                </summary>

                <div className="p-5 border-t border-stone-200 space-y-3 bg-white/80">
                  
                  {/* Header with Quote Info */}
                  <div className="mb-4 p-3 bg-stone-900 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-stone-400">{language === 'EN' ? 'Quote Reference' : 'Referencia de Cotización'}</span>
                      <span className="text-xs font-mono font-bold text-amber-300">{getQuoteCode()}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-stone-400">{language === 'EN' ? 'Project Size' : 'Tamaño del Proyecto'}</span>
                      <span className="font-bold">{squareFeet.toLocaleString('en-US')} sq ft</span>
                    </div>
                  </div>

                  {/* 1. Base Area Subtotal */}
                  <div className="flex justify-between items-center py-2.5 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">1</div>
                      <span className="text-stone-700 text-xs">
                        {language === 'EN'
                          ? `Base Area (${squareFeet.toLocaleString('en-US')} sq ft × $${selectedSystemObj.basePricePerSqFt.toFixed(2)})`
                          : `Área Base (${squareFeet.toLocaleString('en-US')} sq ft × $${selectedSystemObj.basePricePerSqFt.toFixed(2)})`}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-stone-900">{formatCurrency(breakdown.grossBaseCost)}</span>
                  </div>

                  {/* 2. Volume Discount - Conditional */}
                  {breakdown.volumeDiscountPercent > 0 && (
                    <div className="flex justify-between items-center py-2.5 border-b border-stone-100 bg-emerald-500/5 -mx-2 px-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-emerald-800 text-xs font-semibold">
                          {language === 'EN'
                            ? `Volume Discount Tier ${breakdown.volumeDiscountPercent === 18 ? '(>2,000 sq ft)' : '(500-2,000 sq ft)'} (-${breakdown.volumeDiscountPercent}%)`
                            : `Descuento por Volumen ${breakdown.volumeDiscountPercent === 18 ? '(>2,000 sq ft)' : '(500-2,000 sq ft)'} (-${breakdown.volumeDiscountPercent}%)`}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-emerald-700">-{formatCurrency(breakdown.volumeDiscountAmount)}</span>
                    </div>
                  )}

                  {/* 3. Substrate Preparation */}
                  <div className={`flex justify-between items-center py-2.5 border-b border-stone-100 ${breakdown.substratePrepDiscountApplied ? 'bg-amber-500/5 -mx-2 px-2 rounded-lg' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">
                        {breakdown.substratePrepDiscountApplied ? '✓' : '3'}
                      </div>
                      <div>
                        <span className="text-stone-700 text-xs block">
                          {language === 'EN' ? `Substrate Prep (${selectedSubstrateObj.nameEn || selectedSubstrateObj.name})` : `Preparación Sustrato (${selectedSubstrateObj.name})`}
                        </span>
                        {breakdown.substratePrepDiscountApplied && (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            {language === 'EN' ? 'Logistics discount applied (-15%)' : 'Descuento logística aplicado (-15%)'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-semibold text-stone-900 block">{formatCurrency(breakdown.substratePrepCost)}</span>
                      {breakdown.substratePrepDiscountApplied && (
                        <span className="text-[10px] text-stone-500 line-through">
                          {formatCurrency(Math.round(squareFeet * selectedSubstrateObj.extraPrepCostPerSqFt))}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4. UV Protection Factor */}
                  <div className={`flex justify-between items-center py-2.5 border-b border-stone-100 ${location === 'outdoor' ? 'bg-blue-500/5 -mx-2 px-2 rounded-lg' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">
                        {location === 'outdoor' ? '☀️' : '4'}
                      </div>
                      <div>
                        <span className="text-stone-700 text-xs block">
                          {language === 'EN' 
                            ? `UV Protection ${location === 'outdoor' ? '(Polyaspartic Shield Required)' : '(Standard Indoor)'}`
                            : `Protección UV ${location === 'outdoor' ? '(Escudo Poliaspártico)' : '(Interior Estándar)'}`}
                        </span>
                        {location === 'outdoor' && (
                          <span className="text-[10px] text-blue-700 font-semibold">
                            {language === 'EN' ? '+20% base cost for UV resistance' : '+20% costo base por resistencia UV'}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`font-mono text-sm font-semibold ${location === 'outdoor' ? 'text-blue-700' : 'text-stone-400'}`}>
                      {location === 'outdoor' ? formatCurrency(breakdown.locationFactorCost) : language === 'EN' ? 'Included' : 'Incluido'}
                    </span>
                  </div>

                  {/* Technical Specifications Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 uppercase tracking-wide font-semibold">
                        <ShieldCheck className="w-3 h-3 text-[#007BFF]" />
                        {language === 'EN' ? 'Compressive Strength' : 'Resistencia Compresión'}
                      </div>
                      <div className="text-lg font-bold text-stone-900 font-mono">{selectedSystemObj.psiStrength} <span className="text-xs font-normal text-stone-500">PSI</span></div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 uppercase tracking-wide font-semibold">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {language === 'EN' ? 'Installation Time' : 'Tiempo Instalación'}
                      </div>
                      <div className="text-lg font-bold text-stone-900 font-mono">{breakdown.estimatedDays} <span className="text-xs font-normal text-stone-500">{language === 'EN' ? 'days' : 'días'}</span></div>
                    </div>
                    
                    <div className="space-y-1 col-span-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 uppercase tracking-wide font-semibold">
                        <Award className="w-3 h-3 text-emerald-600" />
                        {language === 'EN' ? 'Written Warranty Coverage' : 'Cobertura Garantía Escrita'}
                      </div>
                      <div className="text-lg font-bold text-emerald-700 font-mono">{selectedSystemObj.warrantyYears} <span className="text-xs font-normal text-stone-500">{language === 'EN' ? 'years full coverage' : 'años cobertura total'}</span></div>
                    </div>
                  </div>

                  {/* Total Summary Line */}
                  <div className="mt-4 pt-4 border-t-2 border-stone-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-stone-900">
                        {language === 'EN' ? 'TOTAL ESTIMATED INVESTMENT' : 'INVERSIÓN TOTAL ESTIMADA'}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-serif-heading font-bold text-stone-900">{formatCurrency(breakdown.totalCost)}</div>
                        <div className="text-[10px] text-stone-500 font-mono">USD • {language === 'EN' ? '30-day validity' : 'validez 30 días'}</div>
                      </div>
                    </div>
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

