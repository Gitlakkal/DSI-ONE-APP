import React from 'react';
import { Sparkles, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ModularFutureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const ModularFutureModal: React.FC<ModularFutureModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Modular Architecture v2</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
            <p className="font-bold text-[#0B2545] text-xs">
              System Ready for Integration
            </p>
            <p className="leading-relaxed">
              {description}
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-800">Architectural Compatibility Checklist:</p>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Firestore collections reserved for seamless non-breaking deployment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Zero-Trust ABAC security rules modularly extendable</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Multi-role access hierarchy (Employee, Supervisor, HR/Admin, Super Admin) fully wired</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#123966] text-white"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
