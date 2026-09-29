'use client';

import { useState } from 'react';
import SuccessModal from '@/app/components/SuccessModal';

interface BookingFormProps {
  packageTitle: string;
  packageDuration?: string; // e.g., "3 Nights 4 Days"
}

export default function BookingForm({ packageTitle, packageDuration = '' }: BookingFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    stayType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/mail/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          packageTitle,
          packageDuration,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          phone: '',
          startDate: '',
          endDate: '',
          stayType: '',
          message: '',
        });
      } else {
        setStatus('error');
        setError(json.error || 'Failed to send booking');
      }
    } catch (err) {
      console.error('[BOOKING SUBMIT ERROR]', err);
      setStatus('error');
      setError('Network or server error');
    }
  };

  return (
    <>
      <SuccessModal
        open={status === 'success'}
        title="Thank you, your booking enquiry is with us"
        message="We will check availability, route comfort, and stay preferences, then get back to you shortly."
        onClose={() => setStatus('idle')}
      />
      <form onSubmit={onSubmit} className="card-shell space-y-6 rounded-[1.6rem] p-6">
      {/* Package context */}
      <div className="rounded-[1.2rem] border border-[rgba(17,24,39,0.08)] bg-[var(--surface-soft)] p-4">
        <p className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--text-dark)]">Package:</span> {packageTitle}
          {packageDuration && (
            <> &middot; <span className="font-semibold text-[var(--accent)]">{packageDuration}</span></>
          )}
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Your Name</label>
        <input
          className="input-brand w-full p-3 font-medium"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={onChange}
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Email</label>
        <input
          type="email"
          className="input-brand w-full p-3 font-medium"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Phone</label>
        <input
          className="input-brand w-full p-3 font-medium"
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={onChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Travel Start Date</label>
          <input
            type="date"
            name="startDate"
            min={today}
            value={form.startDate}
            onChange={onChange}
            className="input-brand w-full p-3 font-medium"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Travel End Date</label>
          <input
            type="date"
            name="endDate"
            min={form.startDate || today}
            value={form.endDate}
            onChange={onChange}
            className="input-brand w-full p-3 font-medium"
          />
        </div>
      </div>

      {/* Stay Type */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Preferred Stay Style</label>
        <select
          name="stayType"
          value={form.stayType}
          onChange={onChange}
          className="input-brand w-full p-3 font-medium"
        >
          <option value="">Select your preference</option>
          <option value="Budget">Budget</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Additional Notes (optional)</label>
        <textarea
          className="input-brand w-full p-3 font-medium"
          name="message"
          rows={4}
          placeholder="Share any special requests, comfort preferences, or questions you would like us to consider"
          value={form.message}
          onChange={onChange}
        />
      </div>

      {/* Submit */}
      <button
        disabled={status === 'loading'}
        className="btn-brand w-full rounded-full px-6 py-3 font-semibold transition"
      >
        {status === 'loading' ? 'Sending…' : 'Send Booking Enquiry'}
      </button>

      {/* Status messages */}
      {status === 'error' && <p className="rounded-xl border border-[rgba(255,77,109,0.24)] bg-[rgba(255,77,109,0.1)] px-4 py-3 text-center text-[var(--pink)]">{error}</p>}
      </form>
    </>
  );
}
