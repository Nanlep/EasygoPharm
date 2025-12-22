
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { StorageService } from '../services/storageService';
import { ShieldCheck, LogOut, Menu, X, Lock, Facebook, Instagram, Twitter, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = StorageService.getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    StorageService.logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? "text-red-700 font-semibold" : "text-slate-600 hover:text-red-700";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>
            
            <nav className="hidden md:flex space-x-8 items-center">
              {!user ? (
                <>
                  <Link to="/" className={isActive('/')}>Home</Link>
                  <Link to="/request-drug" className={isActive('/request-drug')}>Request Drug</Link>
                  <Link to="/book-consult" className={isActive('/book-consult')}>Consultations</Link>
                </>
              ) : (
                <>
                  <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
                  <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                    <div className="text-right hidden lg:block">
                      <div className="text-sm font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.role.replace('_', ' ')}</div>
                    </div>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-2">
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              )}
            </nav>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 hover:text-slate-700 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
               {!user ? (
                <>
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-red-700 hover:bg-slate-50">Home</Link>
                  <Link to="/request-drug" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-red-700 hover:bg-slate-50">Request Drug</Link>
                  <Link to="/book-consult" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-red-700 hover:bg-slate-50">Consultations</Link>
                </>
              ) : (
                 <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-red-700 hover:bg-slate-50">Dashboard</Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Logo className="text-white mb-6 [&_span]:text-white" />
              <p className="text-sm leading-relaxed mb-6">
                EasygoPharm is a global leader in specialized pharmaceutical sourcing and medical triage. Our platform bridges the gap between rare medication availability and urgent patient needs using proprietary AI and verified logistics.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-white transition-colors"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-white transition-colors"><Facebook size={18} /></a>
                <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-white transition-colors"><Instagram size={18} /></a>
                <a href="#" className="p-2 bg-slate-900 rounded-lg hover:text-white transition-colors"><MessageCircle size={18} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Medical Platform</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/request-drug" className="hover:text-red-500 transition-colors">Drug Sourcing Portal</Link></li>
                <li><Link to="/book-consult" className="hover:text-red-500 transition-colors">Telehealth Triage</Link></li>
                <li><Link to="/login" className="hover:text-red-500 transition-colors">Staff Login</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-red-500 transition-colors">Privacy & SOC 2</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Business Inquiries</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-red-600 shrink-0" />
                  <span>easygo@easygopharm.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-red-600 shrink-0" />
                  <span>+2348160248996</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-red-600 shrink-0" />
                  <span>No. 5 Kwaji Close, <br/>Maitama, Abuja FCT</span>
                </li>
              </ul>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Compliance</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span className="text-xs font-bold text-slate-300">ISO 27001 Certified</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <Lock size={20} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-300">SOC 2 Type II Audited</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <p>&copy; {new Date().getFullYear()} EasygoPharm Global Logistics. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link to="/legal/terms" className="hover:text-slate-400">Terms of Use</Link>
              <Link to="/legal/privacy" className="hover:text-slate-400">Security Architecture</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
