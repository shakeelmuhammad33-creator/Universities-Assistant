import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  XSquare, 
  Info, 
  ChevronRight,
  TrendingUp,
  Percent,
  Search
} from 'lucide-react';
import { University, Program, DegreeLevel } from '../types';

interface EligibilityCheckerProps {
  universities: University[];
  programs: Program[];
}

export default function EligibilityChecker({ universities, programs }: EligibilityCheckerProps) {
  const [level, setLevel] = useState<DegreeLevel | ''>('');
  const [subject, setSubject] = useState<string>('');
  const [universityId, setUniversityId] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('');
  const [result, setResult] = useState<{ eligible: boolean; message: string; program?: Program } | null>(null);

  // Derived data for dynamic dropdowns
  const availableSubjects = Array.from(new Set(
    programs
      .filter(p => !level || p.level === level)
      .map(p => p.name)
  )).sort();

  const availableUniversities = universities.filter(u => 
    programs.some(p => 
      p.universityId === u.id && 
      (!level || p.level === level) && 
      (!subject || p.name === subject)
    )
  );

  const handleCheck = () => {
    if (!level || !subject || !universityId || !percentage) {
      alert('براہ کرم تمام معلومات مکمل کریں');
      return;
    }

    const userPercent = parseFloat(percentage);
    if (isNaN(userPercent)) {
      alert('براہ کرم درست پرسنٹیج درج کریں');
      return;
    }

    if (userPercent < 0 || userPercent > 100) {
      alert('براہ کرم 0 سے 100 کے درمیان پرسنٹیج درج کریں');
      return;
    }

    const matchedProgram = programs.find(p => 
      p.universityId === universityId && 
      p.level === level && 
      p.name === subject
    );

    if (!matchedProgram) {
      setResult({
        eligible: false,
        message: 'اس یونیورسٹی میں اس لیول پر یہ پروگرام ابھی دستیاب نہیں ہے۔'
      });
      return;
    }

    // Comparison Logic - Strictly matching minPercentage from Admin Panel
    if (userPercent >= matchedProgram.minPercentage) {
      setResult({
        eligible: true,
        message: `آپ اس پروگرام کے لیے اہل (Eligible) ہیں۔ آپ کا اسکور ${userPercent}% ہے جبکہ کم از کم ضرورت ${matchedProgram.minPercentage}% ہے۔`,
        program: matchedProgram
      });
    } else {
      const diff = (matchedProgram.minPercentage - userPercent).toFixed(1);
      setResult({
        eligible: false,
        message: `معذرت، آپ نااہل (Not Eligible) ہیں۔ آپ کا اسکور ضرورت سے ${diff}% کم ہے۔ اس پروگرام کے لیے کم از کم ${matchedProgram.minPercentage}% درکار ہیں۔`,
        program: matchedProgram
      });
    }
  };

  const reset = () => {
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <section className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">اہلیت چیکر (Eligibility)</h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-tight">لائیو سنکرونائزیشن</span>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">1. پروگرام کا درجہ (Degree Level)</label>
              <div className="grid grid-cols-4 gap-2">
                {['BS', 'MS', 'MPhil', 'PhD'].map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLevel(l as DegreeLevel); setSubject(''); setUniversityId(''); }}
                    className={`h-11 rounded-lg text-xs font-bold transition-all border ${
                      level === l 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">2. مضمون کا انتخاب (Subject)</label>
              <select 
                value={subject}
                onChange={(e) => { setSubject(e.target.value); setUniversityId(''); }}
                disabled={!level}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{level ? 'مضمون منتخب کریں' : 'پہلے ڈگری لیول منتخب کریں'}</option>
                {availableSubjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">3. یونیورسٹی کا انتخاب (University)</label>
              <select 
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                disabled={!subject}
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{subject ? 'یونیورسٹی منتخب کریں' : 'پہلے مضمون منتخب کریں'}</option>
                {availableUniversities.map(u => (
                  <option key={u.id} value={u.id}>{u.nameUrdu}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">آخری ڈگری کا پرسنٹیج (%)</label>
              <div className="relative">
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="number" 
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="مثلاً: 65"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 font-bold text-sm outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleCheck}
              className="w-full h-12 bg-emerald-600 text-white rounded-lg font-black text-sm shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Search size={18} />
              چیک کریں (Check)
            </button>
          </div>
        </section>

        {/* Result Container */}
        <section className="lg:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl border-2 border-dashed border-slate-200 h-[500px] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 mb-6 group hover:border-emerald-200 transition-colors">
                  <TrendingUp size={40} className="group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">اہلیت کا نتیجہ یہاں ظاہر ہوگا</h3>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                   براہ کرم بائیں جانب دیئے گئے فارم میں اپنی تعلیمی معلومات درج کریں اور 'چیک کریں' کے بٹن پر کلک کریں۔
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-8 shadow-sm border-r-8 h-full flex flex-col bg-white overflow-hidden ${
                  result.eligible 
                    ? 'border-emerald-500' 
                    : 'border-orange-500'
                }`}
              >
                <div className="flex items-center gap-6 mb-8">
                   <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg ${result.eligible ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                      {result.eligible ? <CheckCircle size={32} /> : <XSquare size={32} />}
                   </div>
                   <div>
                     <h3 className={`text-2xl font-black mb-1 ${result.eligible ? 'text-emerald-900' : 'text-orange-900'}`}>
                        {result.eligible ? 'آپ اہل (Eligible) ہیں!' : 'معذرت، نااہل (Not Eligible)'}
                     </h3>
                     <p className={`text-sm font-bold ${result.eligible ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {result.message}
                     </p>
                   </div>
                </div>

                {result.program && (
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 mt-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-black text-slate-800">{result.program.name}</h4>
                      <span className="text-[10px] font-black uppercase bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">{result.program.level}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-3 bg-white rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">سمسٹر فیس</p>
                          <p className="text-sm font-black text-emerald-700">PKR {result.program.feePerSemester.toLocaleString()}</p>
                       </div>
                       <div className="p-3 bg-white rounded border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">طریقہ کار</p>
                          <p className="text-sm font-black text-slate-700">{result.program.classMode === 'Regular' ? 'ریگولر' : 'آن لائن'} ({result.program.classSchedule === 'Weekdays' ? 'پیر تا جمعہ' : result.program.classSchedule === 'Weekend' ? 'ہفتہ، اتوار' : 'فاصلاتی تعلیم'})</p>
                       </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 p-4 bg-white rounded-lg border-r-4 border-emerald-300">
                       <Info size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-tight">اہلیت کی شرائط</p>
                         <p className="text-xs text-slate-700 leading-normal">{result.program.eligibilityCriteria}</p>
                       </div>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-8 flex justify-center">
                   <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest"
                  >
                    دوبارہ چیک کریں (RESET)
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
