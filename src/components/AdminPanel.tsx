import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  GraduationCap, 
  School,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { University, Program, DegreeLevel, ClassMode, ClassSchedule } from '../types';
import { StorageService } from '../lib/storage';

interface AdminPanelProps {
  universities: University[];
  programs: Program[];
  setUniversities: React.Dispatch<React.SetStateAction<University[]>>;
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
}

export default function AdminPanel({ universities, programs, setUniversities, setPrograms }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'universities' | 'programs'>('universities');
  
  // University Form State
  const [uForm, setUForm] = useState<Partial<University>>({
    id: '', name: '', nameUrdu: '', location: '', locationUrdu: '', description: ''
  });
  const [editingUId, setEditingUId] = useState<string | null>(null);

  // Program Form State
  const [pForm, setPForm] = useState<Partial<Program>>({
    id: '', universityId: '', name: '', level: 'BS', feePerSemester: 0, 
    eligibilityCriteria: '', minPercentage: 0, classMode: 'Regular', 
    classSchedule: 'Weekdays', description: ''
  });
  const [editingPId, setEditingPId] = useState<string | null>(null);

  // University Handlers
  const handleUSave = async () => {
    if (!uForm.name || !uForm.nameUrdu || !uForm.location) {
      alert('بنیادی معلومات لازمی ہیں');
      return;
    }

    let finalU: University;
    if (editingUId) {
      finalU = { ...uForm, id: editingUId } as University;
      setUniversities(prev => prev.map(u => u.id === editingUId ? finalU : u));
      setEditingUId(null);
    } else {
      finalU = { ...uForm, id: Date.now().toString() } as University;
      setUniversities(prev => [...prev, finalU]);
    }
    
    await StorageService.saveUniversity(finalU);
    setUForm({ id: '', name: '', nameUrdu: '', location: '', locationUrdu: '', description: '' });
  };

  const handleUDelete = async (id: string) => {
    if (window.confirm('کیا آپ واقعی اس یونیورسٹی کو حذف کرنا چاہتے ہیں؟ اس سے متعلق تمام پروگرامز بھی ختم ہو جائیں گے۔')) {
      setUniversities(prev => prev.filter(u => u.id !== id));
      const affectedPrograms = programs.filter(p => p.universityId === id);
      setPrograms(prev => prev.filter(p => p.universityId !== id));
      
      await StorageService.deleteUniversity(id);
      await Promise.all(affectedPrograms.map(p => StorageService.deleteProgram(p.id)));
    }
  };

  const handleUEdit = (u: University) => {
    setUForm(u);
    setEditingUId(u.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Program Handlers
  const handlePSave = async () => {
    if (!pForm.universityId || !pForm.name || !pForm.level) {
      alert('یونیورسٹی، پروگرام کا نام اور لیول لازمی ہیں');
      return;
    }

    let finalP: Program;
    if (editingPId) {
      finalP = { ...pForm, id: editingPId } as Program;
      setPrograms(prev => prev.map(p => p.id === editingPId ? finalP : p));
      setEditingPId(null);
    } else {
      finalP = { ...pForm, id: Date.now().toString() } as Program;
      setPrograms(prev => [...prev, finalP]);
    }

    await StorageService.saveProgram(finalP);
    setPForm({ 
      id: '', universityId: '', name: '', level: 'BS', feePerSemester: 0, 
      eligibilityCriteria: '', minPercentage: 0, classMode: 'Regular', 
      classSchedule: 'Weekdays', description: '' 
    });
  };

  const handlePDelete = async (id: string) => {
    if (window.confirm('کیا آپ واقعی اس پروگرام کو حذف کرنا چاہتے ہیں؟')) {
      setPrograms(prev => prev.filter(p => p.id !== id));
      await StorageService.deleteProgram(id);
    }
  };

  const handlePEdit = (p: Program) => {
    setPForm(p);
    setEditingPId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">کنٹرول پینل (Admin)</h2>
          <p className="text-slate-500 font-medium">نظام کے ڈیٹا کو منظم کریں</p>
        </div>
        
        <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('universities')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'universities' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            یونیورسٹیز
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'programs' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            پروگرامز
          </button>
        </div>
      </div>

      {activeTab === 'universities' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <School size={16} className="text-emerald-500" />
                یونیورسٹیز کی فہرست ({universities.length})
              </h3>
            </div>
            
            <div className="grid gap-3">
              {universities.map(u => (
                <div key={u.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center group hover:border-emerald-300 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-black border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      {u.nameUrdu.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">{u.nameUrdu}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{u.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleUEdit(u)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleUDelete(u.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden sticky top-6">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${editingUId ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  {editingUId ? 'ترمیم کریں (EDIT)' : 'نیا اندراج (NEW)'}
                </h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">یونیورسٹی کا نام (اردو)</label>
                  <input 
                    type="text" 
                    value={uForm.nameUrdu}
                    onChange={(e) => setUForm({...uForm, nameUrdu: e.target.value})}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">University Name (English)</label>
                  <input 
                    type="text" 
                    value={uForm.name}
                    onChange={(e) => setUForm({...uForm, name: e.target.value})}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">مقام (اردو)</label>
                    <input 
                      type="text" 
                      value={uForm.locationUrdu}
                      onChange={(e) => setUForm({...uForm, locationUrdu: e.target.value})}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Location (EN)</label>
                    <input 
                      type="text" 
                      value={uForm.location}
                      onChange={(e) => setUForm({...uForm, location: e.target.value})}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">تفصیل (Urdu Description)</label>
                  <textarea 
                    value={uForm.description}
                    onChange={(e) => setUForm({...uForm, description: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-medium outline-none focus:border-emerald-500 transition-all text-slate-600 leading-relaxed"
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleUSave}
                    className="flex-grow h-12 bg-emerald-600 text-white rounded-lg font-black text-sm shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    <Save size={18} />
                    {editingUId ? 'اپڈیٹ کریں' : 'محفوظ کریں'}
                  </button>
                  {editingUId && (
                    <button 
                      onClick={() => { setEditingUId(null); setUForm({id: '', name: '', nameUrdu: '', location: '', locationUrdu: '', description: ''}); }}
                      className="w-12 h-12 bg-slate-100 text-slate-400 rounded-lg border border-slate-200 hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

                <div className="p-4 bg-emerald-50 border-t border-emerald-100 flex gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-emerald-800 leading-normal">
                    ڈیٹا محفوظ (Persistent) کیا جا رہا ہے۔ آپ کی تبدیلیاں اپڈیٹس کے بعد بھی برقرار رہیں گی۔
                  </p>
                </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
              <GraduationCap size={16} className="text-emerald-500" />
              پروگرامز کی فہرست ({programs.length})
            </h3>
            
            <div className="grid gap-3">
              {programs.map(p => {
                const uni = universities.find(u => u.id === p.universityId);
                return (
                  <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center group hover:border-emerald-300 transition-all shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{p.name}</h4>
                         <span className="text-[9px] font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase">{p.level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                         <span>{uni?.nameUrdu || 'نامعلوم'}</span>
                         <span>•</span>
                         <span className="text-emerald-600">PKR {p.feePerSemester.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handlePEdit(p)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handlePDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden sticky top-6">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${editingPId ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  {editingPId ? 'پروگرام ترمیم (EDIT)' : 'نیا پروگرام (NEW)'}
                </h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">یونیورسٹی کا انتخاب</label>
                  <select 
                    value={pForm.universityId}
                    onChange={(e) => setPForm({...pForm, universityId: e.target.value})}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                  >
                    <option value="">یونیورسٹی منتخب کریں</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>{u.nameUrdu}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">پروگرام کا نام</label>
                  <input 
                    type="text" 
                    value={pForm.name}
                    onChange={(e) => setPForm({...pForm, name: e.target.value})}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ڈگری لیول</label>
                    <select 
                      value={pForm.level}
                      onChange={(e) => setPForm({...pForm, level: e.target.value as DegreeLevel})}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all font-black uppercase"
                    >
                      <option value="BS">BS</option>
                      <option value="MS">MS</option>
                      <option value="MPhil">MPhil</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">فیس (PKR)</label>
                    <input 
                      type="number" 
                      value={pForm.feePerSemester}
                      onChange={(e) => setPForm({...pForm, feePerSemester: parseInt(e.target.value) || 0})}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">اہلیت (%)</label>
                    <input 
                      type="number" 
                      value={pForm.minPercentage}
                      onChange={(e) => setPForm({...pForm, minPercentage: parseInt(e.target.value) || 0})}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">کلاس موڈ</label>
                    <select 
                      value={pForm.classMode}
                      onChange={(e) => setPForm({...pForm, classMode: e.target.value as ClassMode})}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all font-black uppercase"
                    >
                      <option value="Regular">ریگولر</option>
                      <option value="Online">آن لائن</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">شیڈول</label>
                    <select 
                      value={pForm.classSchedule}
                      onChange={(e) => setPForm({...pForm, classSchedule: e.target.value as ClassSchedule})}
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all font-black uppercase"
                    >
                      <option value="Weekdays">پیر تا جمعہ</option>
                      <option value="Weekend">ہفتہ، اتوار</option>
                      <option value="DistanceLearning">فاصلاتی تعلیم</option>
                    </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">اہلیت کا معیار (Criteria)</label>
                  <textarea 
                    value={pForm.eligibilityCriteria}
                    onChange={(e) => setPForm({...pForm, eligibilityCriteria: e.target.value})}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-medium outline-none focus:border-emerald-500 transition-all text-slate-600 leading-relaxed"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handlePSave}
                    className="flex-grow h-12 bg-emerald-600 text-white rounded-lg font-black text-sm shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    <Save size={18} />
                    {editingPId ? 'اپڈیٹ کریں' : 'محفوظ کریں'}
                  </button>
                  {editingPId && (
                    <button 
                      onClick={() => { setEditingPId(null); setPForm({ universityId: '', name: '', level: 'BS', feePerSemester: 0, eligibilityCriteria: '', minPercentage: 0, classMode: 'Regular', classSchedule: 'Weekdays', description: '' }); }}
                      className="w-12 h-12 bg-slate-100 text-slate-400 rounded-lg border border-slate-200 hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
