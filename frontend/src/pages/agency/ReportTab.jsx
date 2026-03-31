import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createIncident, autoDispatch } from '../../api/incidentApi';
import { ROLE_TO_AGENCY, SEVERITY_LEVELS, AGENCY_COLORS } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { toast } from '../../components/common/Toast';
import { Spinner } from '../../components/common/Spinner';
import logger from '../../utils/logger';

export function ReportTab({ pin, onPinClear, onSuccess }) {
  const { user } = useAuth();
  const agencyType = ROLE_TO_AGENCY[user?.role] || 'MEDICAL';
  const agencyStyle = AGENCY_COLORS[agencyType] || { color: '#e8622a' };

  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState(null); // null | 'dispatching' | { responder } | 'no_responder'

  const isValid = pin && severity && description.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setDispatchStatus(null);
    setSubmitting(true);
    try {
      const incident = await createIncident({
        type: agencyType,
        severity,
        description: description.trim(),
        latitude: pin.lat,
        longitude: pin.lng,
        address: pin.address || null,
      });
      toast('Incident reported — dispatching nearest responder...', 'info');
      setSeverity('');
      setDescription('');
      onPinClear();
      onSuccess?.();

      // Auto-dispatch: find and assign nearest available responder
      setDispatchStatus('dispatching');
      try {
        const responder = await autoDispatch(incident.id);
        setDispatchStatus({ responder });
        toast(`Dispatched: ${responder.name} (${responder.distanceKm} km away)`, 'success');
      } catch (dispatchErr) {
        logger.warn('Auto-dispatch failed', dispatchErr);
        setDispatchStatus('no_responder');
        toast('Incident created — no available responders nearby. Assign manually.', 'warning');
      }
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
        <h3 className="text-[14px] font-semibold text-primary mb-1">Report New Incident</h3>
        <p className="text-[12px] text-secondary">
          Click on the map to drop a pin at the incident location
        </p>
      </div>

      {/* Dispatch status card — shown after submission */}
      {dispatchStatus && (
        <div className={`mb-4 p-3 rounded-[4px] border text-[13px] flex items-start gap-2.5 ${
          dispatchStatus === 'dispatching'
            ? 'bg-info/10 border-info/30'
            : dispatchStatus === 'no_responder'
            ? 'bg-warning/10 border-warning/30'
            : 'bg-success/10 border-success/30'
        }`}>
          {dispatchStatus === 'dispatching' ? (
            <>
              <Spinner size="sm" />
              <div>
                <p className="font-medium text-info">Finding nearest responder...</p>
                <p className="text-secondary text-[12px] mt-0.5">Auto-dispatch in progress</p>
              </div>
            </>
          ) : dispatchStatus === 'no_responder' ? (
            <>
              <svg className="w-4 h-4 text-warning mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="font-medium text-warning">No responders available</p>
                <p className="text-secondary text-[12px] mt-0.5">Go to Incidents tab to assign manually</p>
              </div>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-success mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="font-medium text-success">Responder dispatched</p>
                <p className="text-primary text-[12px] mt-0.5">{dispatchStatus.responder.name}</p>
                <p className="text-secondary text-[12px]">{dispatchStatus.responder.distanceKm} km away · en route</p>
              </div>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type — locked */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-widest text-secondary mb-1.5">
            Incident Type
          </label>
          <div className="px-3 py-2 border border-subtle rounded-[4px] text-[13px] flex items-center gap-2 bg-input">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: agencyStyle.color }} />
            <span className="text-primary font-medium">{agencyType}</span>
            <span className="text-secondary text-[12px] ml-auto">Locked to your agency</span>
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-widest text-secondary mb-1.5">
            Severity *
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-subtle rounded-[4px] text-[13px] focus:outline-none focus:ring-1 focus:ring-accent bg-input text-primary appearance-none"
          >
            <option value="">Select severity level</option>
            {SEVERITY_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-widest text-secondary mb-1.5">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe the incident..."
            className="w-full px-3 py-2 border border-subtle rounded-[4px] text-[13px] focus:outline-none focus:ring-1 focus:ring-accent resize-none bg-input text-primary placeholder:text-muted"
          />
        </div>

        {/* Location pin status */}
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-widest text-secondary mb-1.5">
            Location
          </label>
          {pin ? (
            <div className="flex items-start gap-2 p-3 bg-success/10 border border-success/30 rounded-[4px] text-[13px]">
              <svg className="w-4 h-4 text-success mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-success font-medium text-[12px]">Location pinned</p>
                <p className="text-primary text-[12px] mt-0.5">
                  {pin.address || `${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={onPinClear}
                className="text-success hover:text-primary text-[12px] underline shrink-0 transition-colors"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/30 rounded-[4px] text-[13px]">
              <svg className="w-4 h-4 text-danger shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-danger font-medium text-[12px]">No location selected</span>
              <span className="text-secondary text-[12px]">— click on the map</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-[13px] text-danger">{error}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid}
          loading={submitting}
        >
          Submit &amp; Auto-Dispatch
        </Button>
      </form>
    </div>
  );
}
