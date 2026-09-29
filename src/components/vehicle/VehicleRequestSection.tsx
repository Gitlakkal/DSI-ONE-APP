import React, { useState } from 'react';
import {
  AlertCircle,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Truck,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { Employee, VehicleRequest } from '../../types';

interface VehicleRequestSectionProps {
  employee: Employee | null;
  vehicleRequests: VehicleRequest[];
  onSubmitVehicleRequest: (req: Omit<VehicleRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

export const VehicleRequestSection: React.FC<VehicleRequestSectionProps> = ({
  employee,
  vehicleRequests,
  onSubmitVehicleRequest,
  isModalOpen = false,
  onCloseModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Form State
  const [date, setDate] = useState('');
  const [requiredTime, setRequiredTime] = useState('08:00 AM');
  const [pickupLocation, setPickupLocation] = useState('DSI Dammam Central Camp');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [passengersCount, setPassengersCount] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const showModal = isModalOpen || internalModalOpen;
  const handleClose = () => {
    setInternalModalOpen(false);
    onCloseModal?.();
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!date) {
      setFormError('Please select a date for the vehicle request.');
      return;
    }
    if (!destination.trim()) {
      setFormError('Please enter a destination.');
      return;
    }
    if (!purpose.trim()) {
      setFormError('Please describe the purpose of the trip.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitVehicleRequest({
        userId: employee?.userId || 'seed-usr-1002',
        employeeId: employee?.employeeId || 'DSI-1002',
        employeeName: employee?.name || 'Staff Member',
        department: employee?.department || 'Operations',
        date,
        requiredTime,
        pickupLocation,
        destination: destination.trim(),
        purpose: purpose.trim(),
        passengersCount: Number(passengersCount),
        remarks: remarks.trim() || undefined,
        status: 'pending',
      });

      // Reset
      setDate('');
      setDestination('');
      setPurpose('');
      setRemarks('');
      handleClose();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit vehicle request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = vehicleRequests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved & Dispatched
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Dispatch
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Vehicle & Fleet Transport</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Book site transport, project transfers, and client coordination transport across Eastern Province.
          </p>
        </div>

        <button
          onClick={() => setInternalModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-all hover:scale-102"
        >
          <Car className="w-4 h-4" />
          Vehicle Request
        </button>
      </div>

      {/* 2. Quick Tips / Policy Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-4 sm:p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-white flex items-center justify-center flex-shrink-0">
          <Truck className="w-5 h-5 text-[#FF6B00]" />
        </div>
        <div className="text-xs text-slate-600 space-y-1">
          <p className="font-bold text-[#0B2545] text-sm">
            DSI Transport Fleet Guidelines · Dammam Hub
          </p>
          <p>
            • Please book standard site journeys at least 24 hours in advance to secure fleet availability.
          </p>
          <p>
            • Once approved by Logistics, driver assignment and plate number will display below. Ensure valid project gate passes are carried.
          </p>
        </div>
      </div>

      {/* 3. Vehicle Requests History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#0B2545]" />
            <h2 className="font-bold text-slate-900 text-base">Transportation Bookings</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
              {filteredRequests.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-[#0B2545] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Car className="w-12 h-12 mx-auto opacity-30 mb-2" />
            <p className="text-sm font-semibold">No vehicle requests found in this view.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Vehicle Request" above to request site transportation.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-4 sm:p-6 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {req.requestNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      Trip Date: {req.date} at {req.requiredTime}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {req.passengersCount} {req.passengersCount === 1 ? 'passenger' : 'passengers'}
                    </span>
                  </div>

                  <div>{getStatusBadge(req.status)}</div>
                </div>

                {/* Route Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Location</span>
                      <span className="font-semibold text-slate-800">{req.pickupLocation}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                    <Navigation className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination</span>
                      <span className="font-semibold text-slate-800">{req.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Purpose & Remarks */}
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs mb-3">
                  <p className="text-slate-700">
                    <span className="font-bold text-slate-600">Purpose: </span>
                    {req.purpose}
                  </p>
                  {req.remarks && (
                    <p className="text-slate-600 mt-1">
                      <span className="font-bold text-slate-500">Remarks: </span>
                      {req.remarks}
                    </p>
                  )}
                </div>

                {/* Assigned Vehicle & Driver (When approved) */}
                {req.status === 'approved' && req.assignedVehicle && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                          Allocated Vehicle
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{req.assignedVehicle}</span>
                      </div>
                    </div>

                    {req.assignedDriver && (
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                            Assigned Driver
                          </span>
                          <span className="font-semibold text-slate-900">{req.assignedDriver}</span>
                        </div>
                        {req.driverPhone && (
                          <a
                            href={`tel:${req.driverPhone}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-2xs hover:bg-emerald-700 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            Call Driver
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Vehicle Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Submit Vehicle Request</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date Required *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Required Time *
                  </label>
                  <select
                    value={requiredTime}
                    onChange={(e) => setRequiredTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    <option value="06:30 AM">06:30 AM (Early Site Shift)</option>
                    <option value="07:30 AM">07:30 AM (Standard Shift Start)</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="05:00 PM">05:00 PM (Shift Handover)</option>
                    <option value="08:00 PM">08:00 PM (Night Ops)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DSI Dammam Central Camp or DSI Head Office"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jubail Industrial City - Phase 3 or Ras Tanura Gate 4"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Passengers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={passengersCount}
                    onChange={(e) => setPassengersCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Preference
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    <option>Standard Pickup (Hilux / D-Max)</option>
                    <option>SUV / Site Patrol</option>
                    <option>Minibus / Coaster (Crew)</option>
                    <option>Heavy Flatbed Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Purpose of Trip *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Generator inspection, Aramco contractor coordination meeting, site delivery..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remarks / Special Equipment (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Carrying heavy toolboxes, safety passes ready"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Vehicle Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
