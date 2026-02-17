
import React, { useState } from 'react';
import { Menu, X, Moon, ChevronDown, LayoutGrid } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Forsiden', href: '#', active: true },
    { name: 'Kart', href: '#' },
    { name: 'Markedsrapporter', href: '#', hasDropdown: true },
    { name: 'Innsikt', href: '#' },
    { name: 'Blogg', href: '#', hasDropdown: true },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[100] h-[44px] md:h-[72px] flex items-center transition-all duration-300">
      {/* Containeren har en større max-width (1820px) enn hovedinnholdet (1680px) og er sentrert */}
      <div className="w-full max-w-[1820px] mx-auto px-2 md:px-1 flex items-center justify-between h-full">
        
        {/* Logo-seksjon */}
        <div className="flex items-center gap-1.5 md:gap-2 group cursor-pointer shrink-0">
          <div className="bg-[#0a0f1d] p-1 md:p-1.5 rounded-md md:rounded-lg group-hover:bg-blue-600 transition-colors">
            <LayoutGrid className="text-white w-3.5 h-3.5 md:w-6 md:h-6" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-[14px] md:text-xl font-manrope font-extrabold text-[#0f172a] tracking-tight">Innsikt</span>
            <span className="text-[6px] md:text-[9px] uppercase font-bold tracking-[0.2em] text-blue-600 hidden xs:block">Skaper Verdi</span>
          </div>
        </div>

        {/* Desktop Links (Skjult på mobil) */}
        <nav className="hidden lg:flex items-center gap-8 ml-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-[13px] font-bold tracking-tight transition-all flex items-center gap-1.5 hover:text-blue-600 ${
                link.active ? 'text-blue-600' : 'text-slate-600'
              }`}
            >
              {link.name}
              {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
            </a>
          ))}
        </nav>

        {/* Right side utilities / Mobile Center Button */}
        <div className="flex-1 flex justify-center lg:justify-end items-center gap-2 md:gap-4 px-1">
          {/* Senter-knapp på mobil, høyre-justert på desktop */}
          <button className="bg-[#0a0f1d] hover:bg-blue-600 text-white px-3 md:px-6 py-1.5 md:py-2.5 rounded-md md:rounded-lg text-[9px] md:text-[13px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-black/10 whitespace-nowrap">
            Få verdivurdering
          </button>
          
          <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all hover:text-blue-600">
            <Moon className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Hamburger Menu Icon */}
        <button 
          className="p-1.5 text-slate-600 shrink-0"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[44px] left-0 w-full bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-[16px] font-bold py-2 border-b border-slate-50 ${
                  link.active ? 'text-blue-600' : 'text-slate-800'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
