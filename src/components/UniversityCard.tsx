import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { University } from '../types';

interface UniversityCardProps {
  university: University;
  onClick: () => void;
  index: number;
  key?: React.Key;
}

export default function UniversityCard({ university, onClick, index }: UniversityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
          <span className="text-base font-black">{university.name.charAt(0)}</span>
        </div>
        <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={18} />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {university.nameUrdu}
        </h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">
          {university.name}
        </p>
        
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
          <MapPin size={12} className="text-emerald-400" />
          <span>{university.locationUrdu}</span>
        </div>
        
        <p className="mt-4 text-xs text-slate-500 italic line-clamp-2 leading-relaxed opacity-80">
          {university.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-bold text-emerald-600 uppercase">تفصیلات دیکھیں</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
      </div>
    </motion.div>
  );
}
