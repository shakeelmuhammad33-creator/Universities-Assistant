import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  ArrowLeft,
  Calendar,
  Clock,
  Briefcase,
  Layers
} from 'lucide-react';
import { University, Program, DegreeLevel, ClassMode, ClassSchedule } from './types';
import { INITIAL_UNIVERSITIES, INITIAL_PROGRAMS } from './data';
import { initFirebase } from './lib/firebase';
import { StorageService } from './lib/storage';
import EligibilityChecker from './components/EligibilityChecker';
import AdminPanel from './components/AdminPanel';
import UniversityCard from './components/UniversityCard';

export default function App() {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [activeTab, setActiveTab] = useState<'universities' | 'checker'>('universities');
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      await initFirebase();
      const [u, p] = await Promise.all([
        StorageService.getUniversities(),
        StorageService.getPrograms()
      ]);
      setUniversities(u);
      setPrograms(p);
      setIsLoading(false);
    };
    bootstrap();
  }, []);

  const filteredUniversities = useMemo(() => {
    return universities.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.nameUrdu.includes(searchQuery) ||
      u.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [universities, searchQuery]);

  const stats = useMemo(() => ({
    universities: universities.length,
    programs: programs.length
  }), [universities, programs]);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden" dir="rtl">
      {/* SIDEBAR */}
      <aside className="w-72 bg-emerald-900 text-white flex flex-col shadow-xl z-50">
        <div className="p-6 border-b border-emerald-800 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-1.5 bg-emerald-400 rounded-sm">
              <GraduationCap size={24} className="text-emerald-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">یونیورسٹیز معاون</h1>
          </div>
          <p className="text-[10px] text-emerald-300 uppercase tracking-widest leading-none">University Assistant</p>
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setView('user'); setActiveTab('universities'); setSelectedUniversity(null); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              view === 'user' && activeTab === 'universities'
                ? 'bg-emerald-800 text-white shadow-inner'
                : 'text-emerald-100/70 hover:bg-emerald-800/50'
            }`}
          >
            <div className={`w-5 h-5 rounded-sm border ${view === 'user' && activeTab === 'universities' ? 'bg-emerald-400 border-emerald-400' : 'border-emerald-400/50'}`} />
            <span className="font-medium">یونیورسٹیز کی فہرست</span>
          </button>

          <button
            onClick={() => { setView('user'); setActiveTab('checker'); setSelectedUniversity(null); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              view === 'user' && activeTab === 'checker'
                ? 'bg-emerald-800 text-white shadow-inner'
                : 'text-emerald-100/70 hover:bg-emerald-800/50'
            }`}
          >
            <div className={`w-5 h-5 rounded-sm border ${view === 'user' && activeTab === 'checker' ? 'bg-emerald-400 border-emerald-400' : 'border-emerald-400/50'}`} />
            <span className="font-medium">اہلیت چیکر (Eligibility)</span>
          </button>

          <div className="pt-4 mt-4 border-t border-emerald-800">
            <button
              onClick={() => setView('admin')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                view === 'admin'
                  ? 'bg-emerald-800 text-orange-200'
                  : 'text-orange-100/50 hover:bg-emerald-800/50'
              }`}
            >
              <div className={`w-5 h-5 rounded-sm ${view === 'admin' ? 'bg-orange-400' : 'border border-orange-400/50'}`} />
              <span className="font-medium">ایڈمن پینل</span>
            </button>
          </div>
        </nav>

        <div className="p-6 bg-emerald-950 text-[10px] uppercase tracking-tighter opacity-50">
          Version 2.0 • 2024 Semester Update
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="تلاش کریں..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 bg-slate-50 rounded-lg border border-slate-200 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-700 capitalize">{view === 'admin' ? 'ایڈمن موڈ' : 'یوزر موڈ'}</span>
              <span className="text-[10px] text-emerald-600 font-bold tracking-tight">سستم آن لائن</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-700">
               {view === 'admin' ? <Settings size={20} /> : <GraduationCap size={20} />}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-grow overflow-y-auto p-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-emerald-800">
               <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="font-bold text-lg">ڈیٹا لوڈ ہو رہا ہے...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
            {view === 'admin' ? (
              <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AdminPanel 
                  universities={universities} 
                  programs={programs}
                  setUniversities={setUniversities}
                  setPrograms={setPrograms}
                />
              </motion.div>
            ) : activeTab === 'checker' ? (
              <motion.div key="checker" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}>
                <EligibilityChecker programs={programs} universities={universities} />
              </motion.div>
            ) : (
              <motion.div key="universities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {selectedUniversity ? (
                  <div className="max-w-4xl">
                    <button 
                      onClick={() => setSelectedUniversity(null)}
                      className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 mb-6 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg transition-colors border border-emerald-100"
                    >
                      <ArrowLeft size={16} />
                      <span>واپس فہرست پر جائیں</span>
                    </button>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="h-40 bg-emerald-900 p-8 flex flex-col justify-end relative">
                         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                         <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-2">{selectedUniversity.nameUrdu}</h2>
                            <div className="flex items-center gap-2 text-emerald-300">
                               <MapPin size={16} />
                               <span className="text-sm font-medium">{selectedUniversity.locationUrdu}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            <Layers size={20} className="text-emerald-600" />
                            دستیاب پروگرامز
                          </h3>
                        </div>

                        <div className="grid gap-4">
                           {programs.filter(p => p.universityId === selectedUniversity.id).length > 0 ? (
                             programs.filter(p => p.universityId === selectedUniversity.id).map(p => (
                               <div key={p.id} className="p-5 border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex justify-between items-center bg-white group">
                                 <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{p.name}</h4>
                                      <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500">{p.level}</span>
                                   </div>
                                   <div className="flex flex-wrap gap-4 mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                     <span className="flex items-center gap-1.5"><Calendar size={13} className="text-emerald-500" /> {p.classSchedule === 'Weekdays' ? 'پیر تا جمعہ' : p.classSchedule === 'Weekend' ? 'هفتہ، اتوار' : 'فاصلاتی تعلیم'}</span>
                                     <span className="flex items-center gap-1.5"><Clock size={13} className="text-emerald-500" /> {p.classMode === 'Regular' ? 'ریگولر' : 'آن لائن'}</span>
                                     <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> {p.minPercentage}% اہلیت</span>
                                   </div>
                                 </div>
                                 <div className="text-right">
                                   <p className="text-lg font-black text-emerald-700 leading-none">PKR {p.feePerSemester.toLocaleString()}</p>
                                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">فی سمسٹر</span>
                                 </div>
                               </div>
                             ))
                           ) : (
                             <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                               <p className="text-slate-400 font-medium italic">اس یونیورسٹی کے لیے ابھی کوئی پروگرام دستیاب نہیں ہے۔</p>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">یونیورسٹیز اور پروگرامز</h2>
                        <p className="text-slate-500 text-sm font-medium">پاکستان کی منتخب یونیورسٹیوں کا درست ڈیٹا بیس</p>
                      </div>
                      <div className="hidden sm:block">
                         <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">ڈیٹا اپڈیٹڈ</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                      {filteredUniversities.map((u, i) => (
                        <UniversityCard key={u.id} university={u} onClick={() => setSelectedUniversity(u)} index={i} />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-emerald-500 flex flex-col justify-center">
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">کل یونیورسٹیز</p>
                          <p className="text-3xl font-black text-slate-800 leading-none">{stats.universities}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-blue-500 flex flex-col justify-center">
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">فعال پروگرامز</p>
                          <p className="text-3xl font-black text-slate-800 leading-none">{stats.programs}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-orange-500 flex flex-col justify-center">
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1.5">نئے داخلے</p>
                          <p className="text-3xl font-black text-orange-600 leading-none uppercase">اوپن</p>
                        </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>

        {/* STATUS BAR */}
        <footer className="h-10 bg-slate-200 flex items-center px-8 justify-between text-[11px] font-medium text-slate-600 shrink-0 border-t border-slate-300">
          <div className="flex gap-4">
             <span>ڈیٹا بیس آخری بار اپڈیٹ ہوا: {new Date().toLocaleDateString('ur-PK')}</span>
             <span className="text-slate-400">|</span>
             <span className="text-emerald-700 font-bold">سمسٹر: بہار 2024</span>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-tighter">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span> سسٹم ایکٹو
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
