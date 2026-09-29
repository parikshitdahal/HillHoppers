'use client';

import { useState } from 'react';
import SuccessModal from '@/app/components/SuccessModal';

export interface CuratedBookingFormProps {
  packageTitle: string;   // e.g., pkg.title
  duration: string;       // e.g., pkg.duration ("3 Nights 4 Days")
}

export default function CuratedBookingForm({ packageTitle, duration }: CuratedBookingFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/book-curated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, packageTitle, duration }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        setError(data?.error || 'Failed to send request. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  };

  return (
    <>
      <SuccessModal
        open={status === 'success'}
        title="Thank you, your enquiry is with us"
        message="We will review your package choice and get in touch shortly with the next step."
        onClose={() => setStatus('idle')}
      />
      <form onSubmit={handleSubmit} className="card-shell space-y-6 rounded-[1.6rem] p-6">
      {/* Package context */}
      <div className="rounded-[1.2rem] border border-[rgba(17,24,39,0.08)] bg-[var(--surface-soft)] p-4">
        <p className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--text-dark)]">Package:</span> {packageTitle}
        </p>
        <p className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--text-dark)]">Duration:</span> <span className="text-[var(--accent)]">{duration}</span>
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Your Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Full name"
          required
          className="input-brand w-full p-3 font-medium outline-none"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="you@example.com"
          required
          className="input-brand w-full p-3 font-medium outline-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          type="text"
          placeholder="Phone number"
          required
          className="input-brand w-full p-3 font-medium outline-none"
        />
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Additional Notes (optional)</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Share any preferences or details you would like us to consider"
          className="input-brand w-full p-3 font-medium outline-none"
        />
      </div>

      {/* Status messages */}
      {status === 'error' && (
        <div className="rounded-xl border border-[rgba(255,77,109,0.24)] bg-[rgba(255,77,109,0.1)] p-3 text-sm text-[var(--pink)]">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`btn-brand w-full rounded-full px-6 py-3 font-semibold transition
                   ${status === 'loading' ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {status === 'loading' ? 'Sending…' : 'Send Enquiry'}
      </button>
      </form>
    </>
  );
}
