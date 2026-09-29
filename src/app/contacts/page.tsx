'use client';

import { useState } from 'react';
import SuccessModal from '@/app/components/SuccessModal';
import FeedbackForm from '@/app/components/FeedbackForm';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading'); setError('');

    try {
      const res = await fetch('/api/mail/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setError(json.error || 'Failed to send message');
      }
    } catch {
      setStatus('error'); setError('Network or server error');
    }
  };

  return (
    <div className="bg-page min-h-screen pt-24 px-4 sm:px-6 pb-12">
      <SuccessModal
        open={status==='success'}
        title="Thank you, we will get back to you"
        message="Your enquiry has reached HillHoppers. Our team will review your trip brief and contact you shortly."
        onClose={() => setStatus('idle')}
      />
      <div className="mx-auto max-w-3xl">
        <div className="card-shell mb-10 rounded-[1.8rem] p-8 text-center">
          <p className="eyebrow mb-3">Start A Conversation</p>
          <h1 className="section-title text-3xl sm:text-4xl">Let&apos;s Plan Your Journey</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            Tell us what kind of journey you have in mind and we&apos;ll help shape the right route, timing, and stay style with care and clarity.
          </p>
        </div>
        <div className="card-shell bg-surface rounded-[1.75rem] p-5 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-brand w-full p-3" name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
            <input className="input-brand w-full p-3" name="email" type="email" placeholder="Email address" value={form.email} onChange={onChange} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-brand w-full p-3" name="phone" placeholder="Phone number" value={form.phone} onChange={onChange} required />
            <input className="input-brand w-full p-3" name="subject" placeholder="Subject or trip brief" value={form.subject} onChange={onChange} />
          </div>
          <textarea className="input-brand w-full p-3" name="message" rows={5} placeholder="Tell us about the places, dates, or travel style you have in mind" value={form.message} onChange={onChange} required />
          <button disabled={status==='loading'} className="btn-brand w-full rounded-full px-6 py-3 font-semibold sm:w-auto">
            {status==='loading' ? 'Sending...' : 'Send Enquiry'}
          </button>
          {status==='error' && <p className="rounded-xl border border-[rgba(255,77,109,0.24)] bg-[rgba(255,77,109,0.1)] px-4 py-3 text-[var(--pink)]">{error}</p>}
        </form>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
}
