import React, { useState, useEffect } from 'react';
import { OwnerInvoice, InvoiceLineItem } from '../types';
import {
  INITIAL_OWNER_INVOICES,
  INDUSTRY_PRICING_PRESETS,
  LOGO_PRICING_TIERS,
  WEB_PRICING_SCOPES,
  AGENCY_BUNDLED_PACKAGES,
  BundledPackage,
  LogoPricingTier,
  WebPricingScope
} from '../data/mockData';
import { OwnerPhotoControl } from './OwnerPhotoControl';
import {
  backendConfigured,
  deleteInvoice as deleteInvoiceRemote,
  isSignedIn,
  listInvoices,
  login as ownerLogin,
  saveInvoice as saveInvoiceRemote,
  signOut,
} from '../lib/ownerStore';

interface OwnerInvoiceViewProps {
  onTabChange?: (tab: any) => void;
}

export const OwnerInvoiceView: React.FC<OwnerInvoiceViewProps> = () => {
  // Owner Authentication Gate State.
  // The session is a short-lived signed token from the `owner` edge function,
  // held in sessionStorage — it dies with the tab and carries no secret.
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isSignedIn());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  // null = still asking the server whether a passcode is configured.
  const [passcodeConfigured, setPasscodeConfigured] = useState<boolean | null>(null);
  // True when the server could not be reached and we are on local copies.
  const [offline, setOffline] = useState(false);

  // Which area of the portal is showing: invoices/pricing or photo control.
  const [portalTab, setPortalTab] = useState<'invoices' | 'photos'>('invoices');

  // Pricing Reference Sub-Tab State
  const [pricingTab, setPricingTab] = useState<'bundles' | 'logo' | 'web' | 'presets'>('bundles');

  // Invoice Management State
  const [invoices, setInvoices] = useState<OwnerInvoice[]>([]);
  const [activeInvoice, setActiveInvoice] = useState<OwnerInvoice | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState<OwnerInvoice | null>(null);

  // New/Editing Invoice Form State
  const [formClientName, setFormClientName] = useState('');
  const [formClientCompany, setFormClientCompany] = useState('');
  const [formClientEmail, setFormClientEmail] = useState('');
  const [formClientPhone, setFormClientPhone] = useState('');
  const [formIssueDate, setFormIssueDate] = useState('2026-07-31');
  const [formDueDate, setFormDueDate] = useState('2026-08-15');
  const [formStatus, setFormStatus] = useState<'Draft' | 'Issued' | 'Paid' | 'Internal Audit'>('Issued');
  const [formNotes, setFormNotes] = useState('INTERNAL OWNER RECORD — Custom project invoice with industry benchmark rates.');
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formTax, setFormTax] = useState<number>(0);

  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: 'li_preset_1',
      description: 'Custom Web Design & Frontend Development Package',
      category: 'Web Design',
      quantity: 1,
      rate: 3500,
      amount: 3500
    },
    {
      id: 'li_preset_2',
      description: 'Custom Vector Logo & Complete Brand Identity System',
      category: 'Logo Design',
      quantity: 1,
      rate: 1200,
      amount: 1200
    }
  ]);

  // Ask the server whether a passcode exists, so the gate can show the right
  // screen instead of a form that might be impossible to satisfy.
  useEffect(() => {
    let cancelled = false;
    backendConfigured().then((ok) => {
      if (!cancelled) setPasscodeConfigured(ok);
    });
    return () => { cancelled = true; };
  }, []);

  // Invoices come from the server once unlocked. Nothing is fetched before
  // that — the list is not public data.
  useEffect(() => {
    if (!isUnlocked) return;
    let cancelled = false;
    listInvoices().then(({ invoices: remote, offline: isOffline }) => {
      if (cancelled) return;
      setOffline(isOffline);
      setInvoices(remote.length ? remote : INITIAL_OWNER_INVOICES);
    });
    return () => { cancelled = true; };
  }, [isUnlocked]);

  // The passcode is compared on the server, against a secret the browser never
  // receives. Nothing here can reveal it, and repeated guesses are throttled.
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    setPinError(null);
    const result = await ownerLogin(pinInput.trim());
    setChecking(false);
    if (result.ok) {
      setIsUnlocked(true);
      setPinInput('');
    } else {
      setPinError(result.message);
    }
  };

  const handleLockPortal = () => {
    signOut();
    setIsUnlocked(false);
    setInvoices([]);
  };

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const discountAmount = (subtotal * formDiscount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * formTax) / 100;
  const grandTotal = taxableAmount + taxAmount;

  // Invoice Items Management
  const handleStartNewInvoiceWithItems = (items: InvoiceLineItem[]) => {
    setActiveInvoice(null);
    setFormClientName('');
    setFormClientCompany('Meridian Digital Design Studio LLC');
    setFormClientEmail('otis@meridianinterface.com');
    setFormClientPhone('281-882-9198');
    setFormIssueDate(new Date().toISOString().split('T')[0]);
    setFormDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setFormStatus('Issued');
    setFormNotes('INTERNAL OWNER RECORD — Custom project invoice generated from industry standard pricing benchmarks.');
    setFormDiscount(0);
    setFormTax(0);
    setLineItems(items);
    setIsCreatingNew(true);
  };

  const handleAddBundleToInvoice = (bundle: BundledPackage) => {
    const newItem: InvoiceLineItem = {
      id: `li_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: `${bundle.name} (${bundle.priceRange}) — ${bundle.features.join(' • ')}`,
      category: 'Web Design',
      quantity: 1,
      rate: bundle.defaultPrice,
      amount: bundle.defaultPrice
    };

    if (!isCreatingNew) {
      handleStartNewInvoiceWithItems([newItem]);
    } else {
      setLineItems([...lineItems, newItem]);
    }
  };

  const handleAddLogoTierToInvoice = (tier: LogoPricingTier, isFullPackage: boolean) => {
    const title = isFullPackage ? `Full Brand Identity Package (${tier.providerTier})` : `Basic Logo Design (${tier.providerTier})`;
    const desc = isFullPackage ? tier.fullBrandDesc : tier.basicLogoDesc;
    const rate = isFullPackage ? tier.fullBrandRate : tier.basicLogoRate;

    const newItem: InvoiceLineItem = {
      id: `li_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: `${title} — ${desc}`,
      category: 'Logo Design',
      quantity: 1,
      rate,
      amount: rate
    };

    if (!isCreatingNew) {
      handleStartNewInvoiceWithItems([newItem]);
    } else {
      setLineItems([...lineItems, newItem]);
    }
  };

  const handleAddWebScopeToInvoice = (scope: WebPricingScope) => {
    const newItem: InvoiceLineItem = {
      id: `li_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: `${scope.scopeTitle} (Boutique Studio Rate) — ${scope.deliverables}`,
      category: 'Web Design',
      quantity: 1,
      rate: scope.boutiqueAvg,
      amount: scope.boutiqueAvg
    };

    if (!isCreatingNew) {
      handleStartNewInvoiceWithItems([newItem]);
    } else {
      setLineItems([...lineItems, newItem]);
    }
  };

  const handleAddPreset = (preset: typeof INDUSTRY_PRICING_PRESETS[0]) => {
    const newItem: InvoiceLineItem = {
      id: `li_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: `${preset.title} — ${preset.description}`,
      category: preset.category as any,
      quantity: 1,
      rate: preset.rate,
      amount: preset.rate
    };

    if (!isCreatingNew) {
      handleStartNewInvoiceWithItems([newItem]);
    } else {
      setLineItems([...lineItems, newItem]);
    }
  };

  const handleAddCustomLine = () => {
    const newItem: InvoiceLineItem = {
      id: `li_${Date.now()}`,
      description: 'Custom Service / Design Consultation',
      category: 'Custom',
      quantity: 1,
      rate: 500,
      amount: 500
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleUpdateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          const qty = field === 'quantity' ? Number(value) : item.quantity;
          const rt = field === 'rate' ? Number(value) : item.rate;
          updated.amount = qty * rt;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      alert('Please add at least one line item to the invoice.');
      return;
    }

    const invoiceId = activeInvoice ? activeInvoice.id : `INV-OWN-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;

    const newInvoice: OwnerInvoice = {
      id: invoiceId,
      clientName: formClientName.trim() || 'Internal Client / Owner Account',
      clientCompany: formClientCompany.trim() || 'Meridian Digital Design Studio LLC',
      clientEmail: formClientEmail.trim() || 'Meridianinterface@gmail.com',
      clientPhone: formClientPhone.trim() || '281-882-9198',
      issueDate: formIssueDate,
      dueDate: formDueDate,
      lineItems: [...lineItems],
      subtotal,
      discountPercentage: formDiscount,
      taxPercentage: formTax,
      totalAmount: grandTotal,
      status: formStatus,
      notes: formNotes,
      isOwnerOnly: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    let updatedList: OwnerInvoice[];
    if (activeInvoice) {
      updatedList = invoices.map(i => i.id === activeInvoice.id ? newInvoice : i);
    } else {
      updatedList = [newInvoice, ...invoices];
    }

    setInvoices(updatedList);
    // Optimistic: the list updates immediately, then the server confirms. If it
    // cannot be reached the seam keeps a local copy and says so, rather than
    // pretending the invoice was filed.
    void saveInvoiceRemote(newInvoice).then(({ offline: isOffline }) => setOffline(isOffline));

    setIsCreatingNew(false);
    setActiveInvoice(null);
    setShowPrintModal(newInvoice);
  };

  const handleEditInvoice = (inv: OwnerInvoice) => {
    setActiveInvoice(inv);
    setFormClientName(inv.clientName);
    setFormClientCompany(inv.clientCompany);
    setFormClientEmail(inv.clientEmail);
    setFormClientPhone(inv.clientPhone);
    setFormIssueDate(inv.issueDate);
    setFormDueDate(inv.dueDate);
    setFormStatus(inv.status);
    setFormNotes(inv.notes);
    setFormDiscount(inv.discountPercentage || 0);
    setFormTax(inv.taxPercentage || 0);
    setLineItems(inv.lineItems || []);
    setIsCreatingNew(true);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm(`Delete owner invoice #${id}? This action cannot be undone.`)) {
      const updated = invoices.filter(i => i.id !== id);
      setInvoices(updated);
      void deleteInvoiceRemote(id).then(({ offline: isOffline }) => setOffline(isOffline));
    }
  };

  const handleStartNewInvoice = () => {
    setActiveInvoice(null);
    setFormClientName('');
    setFormClientCompany('Meridian Digital Design Studio LLC');
    setFormClientEmail('Meridianinterface@gmail.com');
    setFormClientPhone('281-882-9198');
    setFormIssueDate(new Date().toISOString().split('T')[0]);
    setFormDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    setFormStatus('Issued');
    setFormNotes('INTERNAL OWNER RECORD — Custom web design, logo, mobile app, or dashboard invoice.');
    setFormDiscount(0);
    setFormTax(0);
    setLineItems([
      {
        id: 'li_preset_1',
        description: 'Custom Web Design & Frontend Development Package',
        category: 'Web Design',
        quantity: 1,
        rate: 3500,
        amount: 3500
      },
      {
        id: 'li_preset_2',
        description: 'Custom Vector Logo & Complete Brand Identity Suite',
        category: 'Logo Design',
        quantity: 1,
        rate: 1200,
        amount: 1200
      }
    ]);
    setIsCreatingNew(true);
  };

  // No passcode exists in this build, so the gate cannot be opened. Say so.
  // Still asking the server. Showing either gate now would flash the wrong one.
  if (!isUnlocked && passcodeConfigured === null) {
    return (
      <main className="pt-28 pb-20 px-4 max-w-md mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin" />
          <p className="font-body text-sm text-slate-500">Checking the portal…</p>
        </div>
      </main>
    );
  }

  if (!isUnlocked && passcodeConfigured === false) {
    return (
      <main className="pt-28 pb-20 px-4 max-w-lg mx-auto min-h-screen flex items-center justify-center animate-fadeIn">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8 w-full space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">key_off</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Internal Portal
              </div>
              <h1 className="font-display font-black text-xl text-slate-900 pt-1">
                Set a passcode to open this
              </h1>
            </div>
          </div>

          <p className="font-body text-sm text-slate-600 leading-relaxed">
            The Internal Invoice &amp; Pricing Manager is installed and ready. It just
            has no passcode yet, so there is nothing to unlock it with.
          </p>

          <ol className="space-y-2.5 text-sm text-slate-700 list-decimal list-inside marker:text-slate-400 marker:font-bold">
            <li>Open the Supabase project &rarr; Edge Functions &rarr; Secrets.</li>
            <li>
              Add{' '}
              <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[12px] text-slate-900">
                OWNER_PASSCODE
              </code>{' '}
              and set it to a passcode only you know.
            </li>
            <li>Reload this page. This screen becomes the passcode prompt.</li>
          </ol>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <p className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">shield</span>
              Set it as a Supabase secret, not a site variable
            </p>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Anything named <code className="font-mono">VITE_&hellip;</code> is compiled
              into the pages this site serves, so a passcode set there is readable by
              anyone who opens the site&rsquo;s source. A Supabase secret stays on the
              server. The passcode is checked there and never sent to a browser.
            </p>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-100">
            Invoices are stored in the Meridian database, not in this browser, so
            they survive a cleared cache and follow you between devices.
          </p>
        </div>
      </main>
    );
  }

  // Locked Gate View
  if (!isUnlocked) {
    return (
      <main className="pt-28 pb-20 px-4 max-w-md mx-auto min-h-screen flex items-center justify-center animate-fadeIn">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-6 md:p-8 w-full text-center space-y-6">
          <div className="w-16 h-16 bg-slate-900 text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <span>Internal Portal</span>
            </div>
            <h1 className="font-display font-black text-2xl text-slate-900 pt-2">
              Owner Security Access
            </h1>
            <p className="font-body text-xs text-slate-600 leading-relaxed">
              Enter studio owner passcode to manage internal invoices, pricing benchmark rates, and confidential studio billing records.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Owner Passcode / PIN
              </label>
              <input
                type="password"
                placeholder="Enter owner passcode"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(null);
                }}
                disabled={checking}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-mono font-bold text-slate-900 outline-none transition-colors ${
                  pinError ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-slate-900'
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-[11px] text-red-600 font-bold mt-1" role="alert">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={checking || !pinInput.trim()}
              className="w-full py-3 bg-[#0f172a] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-base">key</span>
              {checking ? 'Checking\u2026' : 'Authenticate Owner Access'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
            Checked on the server, and rate limited. The passcode is never sent to
            or stored in this browser.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-24 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto min-h-screen bg-slate-50 animate-fadeIn">
      {/* Header Bar */}
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              Internal
            </span>
            <span className="text-xs text-slate-500 font-mono">Meridian Digital Studio LLC</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight pt-2">
            Internal Invoice & Pricing Manager
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl pt-1 leading-relaxed">
            Generate and issue internal invoices using industry-standard benchmark pricing for custom logos, web development, mobile app UI, and agency bundled packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setPortalTab('invoices'); handleStartNewInvoice(); }}
            className="px-5 py-2.5 bg-[#0f172a] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">post_add</span>
            Create Internal Invoice
          </button>
          <button
            onClick={handleLockPortal}
            className="px-3 py-2.5 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1"
            title="Lock Owner Portal"
          >
            <span className="material-symbols-outlined text-base">lock</span>
            Lock
          </button>
        </div>
      </section>

      {offline && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">cloud_off</span>
          <div className="text-[12px] leading-relaxed text-amber-900">
            <strong className="font-bold">Working offline.</strong> The Meridian
            database could not be reached, so changes are being kept in this browser
            only. They will be filed the next time you sign in with a connection.
          </div>
        </div>
      )}

      {/* Portal area tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {([
          { id: 'invoices', label: 'Invoices & Pricing', icon: 'receipt_long' },
          { id: 'photos', label: 'Photo Control', icon: 'photo_camera' }
        ] as const).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setPortalTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              portalTab === t.id
                ? 'bg-[#0f172a] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {portalTab === 'photos' && <OwnerPhotoControl />}

      {portalTab === 'invoices' && (
      <>
      {/* Industry Standard Rates & Bundles Reference Matrix */}
      <section className="mb-10 bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
              Industry Standard Benchmark Reference
            </span>
            <h2 className="font-display font-black text-xl text-slate-900 pt-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">payments</span>
              Studio Pricing Matrices & Agency Bundled Packages
            </h2>
          </div>

          {/* Sub-Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPricingTab('bundles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                pricingTab === 'bundles'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Bundled Packages
            </button>
            <button
              onClick={() => setPricingTab('logo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                pricingTab === 'logo'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">palette</span>
              Logo & Brand Identity
            </button>
            <button
              onClick={() => setPricingTab('web')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                pricingTab === 'web'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">language</span>
              Web & App Development
            </button>
            <button
              onClick={() => setPricingTab('presets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                pricingTab === 'presets'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              Quick Presets
            </button>
          </div>
        </div>

        {/* Tab 1: Recommended Agency Bundled Packages */}
        {pricingTab === 'bundles' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-600">
              Fixed bundled packages for boutique design and engineering studios like Meridian Interface:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {AGENCY_BUNDLED_PACKAGES.map((bundle) => (
                <div
                  key={bundle.id}
                  className="border-2 border-slate-200 hover:border-slate-900 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider rounded">
                        {bundle.name}
                      </span>
                      <div className="text-right">
                        <div className="font-display font-black text-xl text-slate-900">
                          ${bundle.defaultPrice.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">{bundle.priceRange}</div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-600 pt-2 leading-relaxed">
                      {bundle.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Package Deliverables:</div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {bundle.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0 pt-0.5">check_circle</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddBundleToInvoice(bundle)}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">post_add</span>
                    Add Bundle to Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Logo & Brand Identity Pricing Table */}
        {pricingTab === 'logo' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-600">
                Industry standard pricing tiers for custom logo design and full brand identity systems:
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-3/12">Provider Tier</th>
                    <th className="p-3 w-4/12">Basic Logo Design Range</th>
                    <th className="p-3 w-4/12">Full Brand Identity Package Range</th>
                    <th className="p-3 w-1/12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {LOGO_PRICING_TIERS.map((tier, idx) => (
                    <tr
                      key={idx}
                      className={tier.isBoutiqueStudio ? 'bg-blue-50/60 font-medium' : 'hover:bg-slate-50'}
                    >
                      <td className="p-3 font-bold text-slate-900">
                        {tier.providerTier}
                        {tier.isBoutiqueStudio && (
                          <span className="block text-[9px] font-extrabold text-amber-800 uppercase">
                            Meridian Studio Benchmark
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-display font-black text-sm text-slate-900">{tier.basicLogo}</div>
                        <div className="text-[11px] text-slate-600 pt-0.5">{tier.basicLogoDesc}</div>
                        <button
                          onClick={() => handleAddLogoTierToInvoice(tier, false)}
                          className="mt-2 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-bold text-slate-800 transition-all flex items-center gap-1"
                        >
                          + Add Basic Logo (${tier.basicLogoRate})
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="font-display font-black text-sm text-slate-900">{tier.fullBrandPackage}</div>
                        <div className="text-[11px] text-slate-600 pt-0.5">{tier.fullBrandDesc}</div>
                        <button
                          onClick={() => handleAddLogoTierToInvoice(tier, true)}
                          className="mt-2 px-2 py-0.5 bg-slate-900 text-white hover:bg-slate-800 rounded text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          + Add Full Brand Suite (${tier.fullBrandRate})
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <span className="material-symbols-outlined text-slate-400">palette</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Web Design & Web Development Pricing Scope Table */}
        {pricingTab === 'web' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-600">
              Standard market pricing by project complexity and studio tier:
            </p>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-3/12">Project Scope</th>
                    <th className="p-3 w-2/12">Freelancer Rate</th>
                    <th className="p-3 w-3/12">Boutique Studio Rate (Meridian)</th>
                    <th className="p-3 w-3/12">Key Scope Deliverables</th>
                    <th className="p-3 w-1/12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {WEB_PRICING_SCOPES.map((scope, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{scope.scopeTitle}</td>
                      <td className="p-3 font-semibold text-slate-700">{scope.freelancerRate}</td>
                      <td className="p-3 bg-blue-50/50">
                        <div className="font-display font-black text-sm text-slate-900">{scope.boutiqueRate}</div>
                        <div className="text-[10px] text-slate-500">Avg Benchmark: ${scope.boutiqueAvg.toLocaleString()}</div>
                      </td>
                      <td className="p-3 text-[11px] text-slate-600 leading-relaxed">{scope.deliverables}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleAddWebScopeToInvoice(scope)}
                          className="px-2.5 py-1 bg-[#0f172a] text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1"
                        >
                          + Add Scope
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-semibold">
                    <td className="p-3 font-bold text-slate-900">Hourly Rate Comparison</td>
                    <td className="p-3 text-slate-700">$50 – $120 / hr</td>
                    <td className="p-3 font-bold text-slate-900 bg-amber-100/50">$100 – $200 / hr</td>
                    <td className="p-3 text-[11px] text-slate-600" colSpan={2}>
                      Boutique studio hourly rate covers dedicated senior UI/UX designers, lead full-stack engineers, and QA.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Standard Presets Grid */}
        {pricingTab === 'presets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {INDUSTRY_PRICING_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-bold uppercase tracking-wider">
                      {preset.category}
                    </span>
                    <span className="font-display font-black text-sm text-slate-900">
                      ${preset.rate.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-slate-900 pt-2 group-hover:text-blue-700 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 font-semibold">Range: {preset.range}</span>
                  <button
                    onClick={() => handleAddPreset(preset)}
                    className="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                    Add to Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Invoice Editor Modal / View */}
      {isCreatingNew && (
        <section className="mb-10 bg-white border-2 border-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
            <div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[10px] font-bold uppercase tracking-wider rounded">
                {activeInvoice ? `Editing #${activeInvoice.id}` : 'New Owner Invoice'}
              </span>
              <h2 className="font-display font-black text-2xl text-slate-900 pt-1">
                {activeInvoice ? 'Modify Internal Invoice' : 'Generate New Owner Service Invoice'}
              </h2>
            </div>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="p-2 text-slate-400 hover:text-slate-800"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <form onSubmit={handleSaveInvoice} className="space-y-6">
            {/* Recipient / Client Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Name / Recipient</label>
                <input
                  type="text"
                  placeholder="e.g. Meridian Internal / Client Name"
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Entity</label>
                <input
                  type="text"
                  placeholder="e.g. Meridian Digital Design Studio LLC"
                  value={formClientCompany}
                  onChange={(e) => setFormClientCompany(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Email</label>
                <input
                  type="email"
                  placeholder="Meridianinterface@gmail.com"
                  value={formClientEmail}
                  onChange={(e) => setFormClientEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Phone</label>
                <input
                  type="text"
                  placeholder="281-882-9198"
                  value={formClientPhone}
                  onChange={(e) => setFormClientPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={formIssueDate}
                  onChange={(e) => setFormIssueDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Invoice Status</label>
                <select
                  value={formStatus}
                  onChange={(e: any) => setFormStatus(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-slate-900"
                >
                  <option value="Issued">Issued</option>
                  <option value="Paid">Paid</option>
                  <option value="Draft">Draft</option>
                  <option value="Internal Audit">Internal Audit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Studio Website</label>
                <input
                  type="text"
                  value="www.meridianinterface.com"
                  readOnly
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono text-slate-600"
                />
              </div>
            </div>

            {/* Quick Add Presets Bar */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-slate-700">bolt</span>
                Quick Add Industry Standard Rate Presets
              </div>
              <div className="flex flex-wrap gap-2">
                {AGENCY_BUNDLED_PACKAGES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleAddBundleToInvoice(b)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-[11px] font-bold text-blue-900 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-xs text-amber-700">stars</span>
                    Bundle: {b.name} (${b.defaultPrice.toLocaleString()})
                  </button>
                ))}
                {INDUSTRY_PRICING_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAddPreset(p)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-800 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-xs text-blue-700">add_circle</span>
                    {p.title} (${p.rate.toLocaleString()})
                  </button>
                ))}
              </div>
            </div>

            {/* Itemized Line Items Table */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Itemized Service Line Items
                </h3>
                <button
                  type="button"
                  onClick={handleAddCustomLine}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Custom Item
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider text-slate-600">
                      <th className="p-3 w-2/12">Category</th>
                      <th className="p-3 w-5/12">Description / Scope</th>
                      <th className="p-3 w-1/12 text-center">Qty / Hours</th>
                      <th className="p-3 w-2/12 text-right">Standard Rate ($)</th>
                      <th className="p-3 w-2/12 text-right">Amount ($)</th>
                      <th className="p-3 w-1/12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <select
                            value={item.category}
                            onChange={(e: any) => handleUpdateLineItem(item.id, 'category', e.target.value)}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-bold text-slate-800"
                          >
                            <option value="Web Design">Web Design</option>
                            <option value="Logo Design">Logo Design</option>
                            <option value="Mobile App UI">Mobile App UI</option>
                            <option value="Analytics Dashboard">Analytics Dashboard</option>
                            <option value="Custom">Custom</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-900 outline-none focus:border-slate-800"
                            placeholder="Service scope..."
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateLineItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-center text-slate-900 outline-none"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            step="50"
                            min="0"
                            value={item.rate}
                            onChange={(e) => handleUpdateLineItem(item.id, 'rate', Number(e.target.value))}
                            className="w-24 p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-right text-slate-900 outline-none"
                          />
                        </td>
                        <td className="p-3 text-right font-display font-black text-slate-900">
                          ${(item.amount || 0).toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals & Notes Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confidential Internal Owner Notes
                </label>
                <textarea
                  rows={4}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-slate-900"
                  placeholder="Enter confidential owner notes or terms..."
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600 font-semibold">
                  <span>Discount (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-slate-300 rounded text-right font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="flex justify-between items-center text-slate-600 font-semibold">
                  <span>Sales / Service Tax (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={formTax}
                    onChange={(e) => setFormTax(Number(e.target.value))}
                    className="w-20 p-1 bg-white border border-slate-300 rounded text-right font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-display font-black text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-xl text-emerald-700 font-mono">${grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-5 py-3 bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#0f172a] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 shadow-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">save</span>
                Save & View Printable Invoice
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Saved Owner Invoices Directory */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 md:p-6 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Invoice Directory
            </div>
            <h2 className="font-display font-black text-xl pt-0.5">
              Saved Internal Owner Invoices ({invoices.length})
            </h2>
          </div>
          <button
            onClick={handleStartNewInvoice}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-blue-500 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Invoice
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-slate-400">receipt_long</span>
            <h3 className="font-display font-bold text-base text-slate-800">No Owner Invoices Created Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click 'Create Internal Invoice' above or select a preset/bundle from the pricing matrix above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider text-slate-500">
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Client / Recipient</th>
                  <th className="p-4">Issue / Due Date</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {inv.id}
                      {inv.isOwnerOnly && (
                        <span className="block text-[9px] font-bold text-amber-700 uppercase">Owner Only</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{inv.clientName}</div>
                      <div className="text-[11px] text-slate-500">{inv.clientCompany}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{inv.issueDate}</div>
                      <div className="text-[11px] text-slate-500">Due: {inv.dueDate}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {inv.lineItems ? inv.lineItems.length : 0} line items
                    </td>
                    <td className="p-4 font-display font-black text-sm text-slate-900">
                      ${(inv.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'Issued'
                          ? 'bg-blue-100 text-blue-800'
                          : inv.status === 'Internal Audit'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setShowPrintModal(inv)}
                        className="p-1.5 text-blue-700 hover:bg-blue-50 rounded"
                        title="View & Print Official Invoice"
                      >
                        <span className="material-symbols-outlined text-lg">print</span>
                      </button>
                      <button
                        onClick={() => handleEditInvoice(inv)}
                        className="p-1.5 text-slate-700 hover:bg-slate-200 rounded"
                        title="Edit Invoice"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Invoice"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Printable Invoice Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-10 border border-slate-300 shadow-2xl relative my-8">
            {/* Action Bar */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider rounded">
                  Internal Owner Invoice View
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">#{showPrintModal.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#0f172a] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(null)}
                  className="p-2 text-slate-500 hover:text-slate-900"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* Invoice Print Layout */}
            <div className="space-y-6 text-slate-900">
              {/* Top Studio Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="text-2xl font-display font-black tracking-tight text-slate-950 uppercase">
                    MERIDIAN INTERFACE
                  </div>
                  <div className="text-xs font-bold text-slate-600 tracking-wider">
                    DIGITAL DESIGN & DEVELOPMENT STUDIO LLC
                  </div>
                  <div className="text-xs text-slate-500 pt-2 leading-relaxed font-body">
                    100 Meridian Plaza, Suite 400<br />
                    New York, NY 10001, United States<br />
                    Phone: <span className="font-semibold text-slate-900">281-882-9198</span><br />
                    Email: <span className="font-semibold text-slate-900">Meridianinterface@gmail.com</span><br />
                    Web: <span className="font-semibold text-slate-900">www.meridianinterface.com</span>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="inline-block px-3 py-1 bg-slate-950 text-white text-xs font-black uppercase tracking-widest rounded">
                    INTERNAL SERVICE INVOICE
                  </div>
                  <div className="font-mono font-black text-xl text-slate-900 pt-1">
                    {showPrintModal.id}
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">
                    Issue Date: <span className="font-mono">{showPrintModal.issueDate}</span>
                  </div>
                  <div className="text-xs text-slate-600 font-semibold">
                    Due Date: <span className="font-mono">{showPrintModal.dueDate}</span>
                  </div>
                  <div className="pt-1">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Status: {showPrintModal.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Billed To / Internal Account:
                </div>
                <div className="font-display font-bold text-sm text-slate-950">{showPrintModal.clientName}</div>
                <div className="text-slate-700 font-semibold">{showPrintModal.clientCompany}</div>
                <div className="text-slate-600 pt-1">
                  Contact: {showPrintModal.clientEmail} • {showPrintModal.clientPhone}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Category</th>
                      <th className="p-3">Service Scope / Item Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Standard Rate</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {showPrintModal.lineItems && showPrintModal.lineItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800">{item.category}</td>
                        <td className="p-3 font-medium text-slate-900">{item.description}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-800">${item.rate.toLocaleString()}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-950">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Subtotal:</span>
                    <span className="font-mono text-slate-950">${(showPrintModal.subtotal || 0).toLocaleString()}</span>
                  </div>
                  {showPrintModal.discountPercentage > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({showPrintModal.discountPercentage}%):</span>
                      <span className="font-mono">-${((showPrintModal.subtotal * showPrintModal.discountPercentage) / 100).toLocaleString()}</span>
                    </div>
                  )}
                  {showPrintModal.taxPercentage > 0 && (
                    <div className="flex justify-between text-slate-600 font-semibold">
                      <span>Tax ({showPrintModal.taxPercentage}%):</span>
                      <span className="font-mono">+${((showPrintModal.subtotal * showPrintModal.taxPercentage) / 100).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-300 flex justify-between font-display font-black text-sm text-slate-950">
                    <span>Total Amount Due:</span>
                    <span className="font-mono text-base text-slate-950">${(showPrintModal.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Footer */}
              {showPrintModal.notes && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Studio Owner Internal Notes:
                  </div>
                  <div className="font-mono text-slate-800 leading-relaxed italic">
                    "{showPrintModal.notes}"
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">MERIDIAN INTERFACE STUDIO • INTERNAL DOCUMENT</p>
                <p>Website: www.meridianinterface.com | Email: Meridianinterface@gmail.com | Phone: 281-882-9198</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </main>
  );
};

