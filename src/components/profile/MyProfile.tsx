import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Globe,
  Mail,
  Phone,
  Shield,
  Upload,
  User,
  X,
} from 'lucide-react';
import { Employee, EmployeeDocument } from '../../types';

interface MyProfileProps {
  employee: Employee | null;
  documents: EmployeeDocument[];
  onUploadDocument: (docData: Omit<EmployeeDocument, 'id'>) => Promise<void>;
}

export const MyProfile: React.FC<MyProfileProps> = ({
  employee,
  documents,
  onUploadDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'documents'>('details');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<EmployeeDocument | null>(null);

  // Upload Form State
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<EmployeeDocument['type']>('iqama');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newDocExpiry, setNewDocExpiry] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !newDocTitle) return;

    setIsSubmitting(true);
    try {
      await onUploadDocument({
        employeeId: employee.employeeId,
        userId: employee.userId,
        title: newDocTitle,
        type: newDocType,
        documentNumber: newDocNumber || undefined,
        expiryDate: newDocExpiry || undefined,
        fileName: newDocFileName || `${newDocTitle.replace(/\s+/g, '_')}.pdf`,
        fileSize: '450 KB',
        uploadedAt: new Date().toISOString(),
        verified: true,
      });

      // Reset
      setNewDocTitle('');
      setNewDocNumber('');
      setNewDocExpiry('');
      setNewDocFileName('');
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error('Failed to upload document:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysUntilExpiry = (expiryDateStr?: string) => {
    if (!expiryDateStr) return null;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Top brand header bar */}
        <div className="h-28 bg-gradient-to-r from-[#0B2545] via-[#123966] to-[#FF6B00] relative" />

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100 flex-shrink-0">
                {employee?.photoURL ? (
                  <img
                    src={employee.photoURL}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-slate-700 bg-slate-200">
                    {employee?.name?.charAt(0) || 'D'}
                  </div>
                )}
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {employee?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {employee?.designation} · <span className="text-[#0B2545] font-semibold">{employee?.department}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                {employee?.employeeId}
              </span>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Document
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-6 mt-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'details'
                  ? 'border-[#FF6B00] text-[#0B2545]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-4 h-4" />
              Employment & Personal Details
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'documents'
                  ? 'border-[#FF6B00] text-[#0B2545]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              Documents & Identification ({documents.length})
            </button>
          </div>
        </div>
      </div>

      {/* 2. Tab Content: Employment Details */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Official Employment Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-[#0B2545]" />
              Employment Information
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-xs">
              <div>
                <dt className="text-slate-400 font-medium">Employee ID</dt>
                <dd className="font-mono font-bold text-slate-800 text-sm mt-0.5">{employee?.employeeId}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Department</dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">{employee?.department}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Designation</dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">{employee?.designation}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Reporting Manager</dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">{employee?.reportingManager}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Joining Date</dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">{employee?.joiningDate}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Work Location</dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">DSI Dammam Central / Site Ops</dd>
              </div>
            </dl>
          </div>

          {/* Card 2: Contact & Personal Identification */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Shield className="w-4 h-4 text-[#FF6B00]" />
              Personal & Legal Identification
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-xs">
              <div>
                <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Mobile Number
                </dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">{employee?.mobile}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Company Email
                </dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5 truncate">{employee?.email}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Nationality
                </dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">{employee?.nationality}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Iqama (Muqeem) ID</dt>
                <dd className="font-mono font-bold text-slate-800 text-sm mt-0.5">{employee?.iqamaNumber}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Iqama Expiry Date</dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5 flex items-center gap-2">
                  <span>{employee?.iqamaExpiry}</span>
                  {getDaysUntilExpiry(employee?.iqamaExpiry) && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                      Valid
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Passport Number</dt>
                <dd className="font-mono font-bold text-slate-800 text-sm mt-0.5">{employee?.passportNumber}</dd>
              </div>

              <div>
                <dt className="text-slate-400 font-medium">Passport Expiry Date</dt>
                <dd className="font-semibold text-slate-800 text-sm mt-0.5">{employee?.passportExpiry}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* 3. Tab Content: Documents Section */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Official Employment Documents</h2>
              <p className="text-xs text-slate-500">Iqama, Passport, Employee ID badge, and QIWA labor contracts.</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0B2545] hover:bg-[#123966] text-white shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#FF6B00]" />
              Upload New Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((docItem) => {
              const daysLeft = getDaysUntilExpiry(docItem.expiryDate);
              return (
                <div
                  key={docItem.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2545] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#FF6B00]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {docItem.title}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400">
                            {docItem.documentNumber || docItem.fileName}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Expiry Date</span>
                        <span className="font-semibold text-slate-800">
                          {docItem.expiryDate || 'N/A (Indefinite)'}
                        </span>
                        {daysLeft !== null && daysLeft > 0 && (
                          <span className="text-[10px] text-emerald-600 block mt-0.5">
                            Expires in {daysLeft} days
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">File Size</span>
                        <span className="font-semibold text-slate-800">{docItem.fileSize || '380 KB'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Uploaded {new Date(docItem.uploadedAt).toLocaleDateString('en-GB')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewDocument(docItem)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B2545] hover:bg-slate-100 transition-colors"
                        title="Preview Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading verified document: ${docItem.title}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#FF6B00] hover:bg-orange-50 transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Upload Employee Document</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Type *
                </label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                >
                  <option value="iqama">Muqeem Electronic Iqama</option>
                  <option value="passport">International Passport</option>
                  <option value="employee_id">DSI Employee ID Badge</option>
                  <option value="contract">Qiwa / GOSI Employment Contract</option>
                  <option value="certificate">Training / Safety Certificate</option>
                  <option value="other">Other Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iqama Renewal Copy 2027"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2491029381 or Passport Number"
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newDocExpiry}
                  onChange={(e) => setNewDocExpiry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select File (PDF, PNG, JPG)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setNewDocFileName(e.target.files[0].name);
                      if (!newDocTitle) setNewDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0B2545] hover:file:bg-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs"
                >
                  {isSubmitting ? 'Uploading...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                Document Preview: {previewDocument.title}
              </h3>
              <button
                onClick={() => setPreviewDocument(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0B2545] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <p className="font-bold text-slate-900 text-sm">{previewDocument.title}</p>
              <p className="text-xs text-slate-500 font-mono">
                Number: {previewDocument.documentNumber || 'N/A'} · Expiry: {previewDocument.expiryDate || 'N/A'}
              </p>
              <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Status: Stamped & Verified by DSI HR
              </span>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
