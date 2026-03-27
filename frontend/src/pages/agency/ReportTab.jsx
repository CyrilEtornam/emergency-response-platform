import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createIncident } from '../../api/incidentApi';
import { ROLE_TO_AGENCY, SEVERITY_LEVELS, AGENCY_COLORS } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { toast } from '../../components/common/Toast';
import logger from '../../utils/logger';

export function ReportTab({ pin, onPinClear, onSuccess }) {
  const { user } = useAuth();
  const agencyType = ROLE_TO_AGENCY[user?.role] || 'MEDICAL';
  const agencyStyle = AGENCY_COLORS[agencyType] || { color: '#1D4ED8' };

  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = pin && severity && description.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSubmitting(true);
    try {
      await createIncident({
        type: agencyType,
        severity,
        description: description.trim(),
        latitude: pin.lat,
        longitude: pin.lng,
        address: pin.address || null,
      });
      toast('Incident reported successfully', 'success');
      setSeverity('');
      setDescription('');
      onPinClear();
      onSuccess?.();
    } catch (err) {
      logger.error('Report incident failed', err);
      setError(err?.message || 'Failed to submit incident. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#F1F5F9] mb-1">Report New Incident</h3>
        <p className="text-xs text-[#94A3B8]">
          Click on the map to drop a pin at the incident location
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type — locked */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
            Incident Type
          </label>
          <div
            className="px-3 py-2 border border-[#334155] rounded text-sm flex items-center gap-2 bg-[#0F172A]"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: agencyStyle.color }}
            />
            <span className="text-[#F1F5F9] font-medium">{agencyType}</span>
            <span className="text-[#94A3B8] text-xs ml-auto">Locked to your agency</span>
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
            Severity *
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-[#334155] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-[#0F172A] text-[#F1F5F9]"
          >
            <option value="">Select severity level</option>
            {SEVERITY_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe the incident..."
            className="w-full px-3 py-2 border border-[#334155] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none bg-[#0F172A] text-[#F1F5F9] placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Location pin status */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1.5">
            Location
          </label>
          {pin ? (
            <div className="flex items-start gap-2 p-3 bg-[#DCFCE7] border border-[#16A34A]/30 rounded text-sm">
              <svg className="w-4 h-4 text-[#16A34A] mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-[#16A34A] font-medium text-xs">Location pinned</p>
                <p className="text-[#111827] text-xs mt-0.5">
                  {pin.address || `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onPinClear}
                className="text-[#16A34A] hover:text-[#166534] text-xs underline shrink-0"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-[#FEE2E2] border border-[#DC2626]/30 rounded text-sm">
              <svg className="w-4 h-4 text-[#DC2626] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-[#DC2626] font-medium text-xs">No location selected</span>
              <span className="text-[#6B7280] text-xs">— click on the map</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-[#FEE2E2] border border-[#DC2626]/30 rounded text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid}
          loading={submitting}
        >
          Submit Incident Report
        </Button>
      </form>
    </div>
  );
}
