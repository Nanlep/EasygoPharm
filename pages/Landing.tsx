
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, Calendar, Shield, Search, ArrowRight, Activity, Globe, Truck, Stethoscope, Lock, Server, FileText, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { LiveAssistant } from '../components/LiveAssistant';

export const Landing: React.FC = () => {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24 lg:py-36 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-red-900/40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/30 border border-red-700/50 text-red-100 text-sm font-medium mb-8 backdrop-blur-sm">
            <Shield size={16} className="text-red-500" />
            <span>ISO 27001 & SOC 2 Type 2 Compliant Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Bridging the gap in <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Global Medical Logistics</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-300 mb-12 leading-relaxed">
            EasygoPharm creates a seamless digital ecosystem for sourcing rare therapeutics and connecting patients with certified specialists. Precision, privacy, and care in every interaction.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/request-drug" className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-red-700 hover:bg-red-800 shadow-xl shadow-red-900/20 transition-all transform hover:-translate-y-1">
              <Pill className="mr-3 -rotate-45 group-hover:rotate-0 transition-transform duration-300" size={24} />
              Request Medication
            </Link>
            <button 
              onClick={() => setShowVoiceAssistant(true)}
              className="group inline-flex items-center justify-center px-8 py-4 border border-slate-600 backdrop-blur-sm bg-slate-800/50 text-lg font-semibold rounded-xl text-white hover:bg-slate-700 hover:border-slate-500 shadow-lg transition-all transform hover:-translate-y-1"
            >
              <Sparkles className="mr-3 text-red-400" size={24} />
              AI Voice Triage
            </button>
          </div>
        </div>
      </section>

      {/* Real-time Availability Visualization (Mock) */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                  <Globe size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Global Sourcing Pulse</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Our Gemini-powered intelligence monitors 500+ pharmaceutical hubs and regulatory bodies in real-time to locate hard-to-find treatments.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">421</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Rare Drugs Monitored</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl font-bold text-red-600">89ms</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Query Latency</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-2xl font-bold text-emerald-600">99.9%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Supply Integrity</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-64 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800')] bg-cover"></div>
              <div className="relative z-10 text-center p-6">
                <Activity className="text-red-500 mx-auto mb-4 animate-pulse" size={48} />
                <div className="text-white font-mono text-xs space-y-1">
                  <div className="text-emerald-400 animate-pulse">Scanning EU Medicines Agency Database...</div>
                  <div className="text-slate-400 italic">Sourcing orphan therapeutics in Bavaria...</div>
                  <div className="text-slate-400">Verifying cold-chain logs via IoT Hub...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Medical Value Chain Process */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base font-bold text-red-700 uppercase tracking-wide mb-2">Our Workflow</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Optimized Medical Value Chain</h3>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              From request to fulfillment, our platform streamlines the complex journey of rare drug acquisition.
            </p>
          </div>

          <div className="relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              <div className="group flex flex-col items-center text-center bg-white p-6">
                <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:border-red-200 group-hover:bg-red-50 transition-colors duration-300">
                  <Search className="text-slate-400 group-hover:text-red-700 transition-colors" size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">1. Request</h4>
                <p className="text-sm text-slate-500">Clinics or patients submit specific rare drug requirements securely.</p>
              </div>

              <div className="group flex flex-col items-center text-center bg-white p-6">
                <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:border-red-200 group-hover:bg-red-50 transition-colors duration-300">
                  <Globe className="text-slate-400 group-hover:text-red-700 transition-colors" size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">2. Global Sourcing</h4>
                <p className="text-sm text-slate-500">We query our international network of verified pharmaceutical suppliers.</p>
              </div>

              <div className="group flex flex-col items-center text-center bg-white p-6">
                <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:border-red-200 group-hover:bg-red-50 transition-colors duration-300">
                  <Stethoscope className="text-slate-400 group-hover:text-red-700 transition-colors" size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">3. Expert Review</h4>
                <p className="text-sm text-slate-500">Medical safety checks and patient consultations with certified doctors.</p>
              </div>

              <div className="group flex flex-col items-center text-center bg-white p-6">
                <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:border-red-200 group-hover:bg-red-50 transition-colors duration-300">
                  <Truck className="text-slate-400 group-hover:text-red-700 transition-colors" size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">4. Secure Delivery</h4>
                <p className="text-sm text-slate-500">Cold-chain compliant logistics ensure the integrity of delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-base font-bold text-red-700 uppercase tracking-wide mb-2">Security Architecture</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Defense-in-Depth Strategy</h3>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Our security posture goes beyond compliance checklists. We engineer trust into every layer of the application stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6">
                <Lock size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">AES-256 Encryption</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                Patient data is encrypted at rest using industry-standard AES-256 algorithms. Data in transit is secured via TLS 1.3, ensuring immunity to eavesdropping.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-700 text-white rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">RBAC & MFA</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                Strict Role-Based Access Control limits data exposure. Multi-Factor Authentication is enforced for all staff, preventing unauthorized account takeover.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Immutable Audit Logs</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                Every interaction with PHI is cryptographically signed and logged. Our audit trails are immutable, satisfying ISO 27001 A.12.4 requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showVoiceAssistant && <LiveAssistant onClose={() => setShowVoiceAssistant(false)} />}
    </div>
  );
};
