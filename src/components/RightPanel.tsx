
import React, { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

const RightPanel: React.FC<{ className?: string }> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Redusert antall innlegg for å unngå scrolling
  const posts = [
    {
      date: 'JAN 12',
      category: 'MARKEDSINNSIKT',
      title: 'BOLIGPRISER OSLO 2026–2028: ANALYSE AV FERSKE PROGNOSER',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      featured: true,
    },
    {
      date: 'JAN 05',
      category: 'MARKEDSINNSIKT',
      title: 'HVORDAN VIL UTVIKLINGEN I STYRINGSRENTA PÅVIRKE BOLIGPRISENE FREMOVER?',
      featured: false,
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    alert('Takk for din påmelding.');
  };

  return (
    <aside className={`bg-[#1e293b] flex flex-col h-full overflow-hidden p-6 md:p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-white">Siste innlegg</h3>
        <button className="text-[11px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-[0.15em] flex items-center gap-1">
          Se alle <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Posts List - Ingen scroll */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="space-y-8">
          {posts.map((post, idx) => (
            <div key={idx} className="group cursor-pointer">
              {post.featured && post.image && (
                <div className="relative aspect-[16/10] rounded-[1rem] overflow-hidden mb-5 bg-slate-900 border border-white/5">
                  <img 
                    src={post.image} 
                    alt="" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-lg tracking-widest uppercase shadow-xl">
                      {post.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-slate-400/80 tracking-widest uppercase">
                <span>{post.date}</span>
                <span className="opacity-30">•</span>
                <span>{post.category}</span>
              </div>
              
              <h4 className="text-white font-manrope font-extrabold leading-[1.3] tracking-tight group-hover:text-blue-400 transition-colors text-lg uppercase">
                {post.title}
              </h4>

              {!post.featured && idx < posts.length - 1 && (
                <div className="mt-8 border-b border-white/5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-8 pt-8 border-t border-white/10 shrink-0">
        <h3 className="text-white font-manrope text-lg font-extrabold leading-[1.3] mb-3 tracking-tight uppercase">
          Motta min månedlige oppdatering på boligmarkedet i Oslo.
        </h3>
        <p className="text-slate-400 text-sm font-semibold mb-6 leading-relaxed italic opacity-80">
          "Faglig og ærlig om fortid, nåtid og fremtid."
        </p>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className={`flex items-center border-b transition-all duration-300 pb-2 ${isFocused ? 'border-blue-500' : 'border-white/20'}`}>
            <input 
              type="email" 
              required
              placeholder="din e-post"
              value={email}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 font-bold text-base w-full py-1 uppercase tracking-widest"
            />
            <button 
              type="submit"
              className="ml-2 p-1.5 text-slate-400 hover:text-white transition-all transform hover:translate-x-1"
              aria-label="Meld deg på"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
        <p className="mt-6 text-[9px] text-slate-500/60 font-black uppercase tracking-[0.2em]">Avmeld når som helst</p>
      </div>
    </aside>
  );
};

export default RightPanel;
